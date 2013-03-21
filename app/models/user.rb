class User < ActiveRecord::Base
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  belongs_to :cohort
  has_many   :votes
  has_many   :topics, :through => :votes

  attr_accessible :name, :email, :password,
                  :password_confirmation, :cohort, :cohort_id

  validates_confirmation_of :password
  validates :cohort_id, presence: true
  validates :name,      presence: true, length: { maximum: 35 }
  validates :email,     presence: true,
                        format:     { with: VALID_EMAIL_REGEX },
                        uniqueness: { case_sensitive: false }
  validates :password,  presence: true, length: { minimum: 6 }
  validates :password_confirmation, presence: true
  has_secure_password

  before_create :default_values
  before_save {self.email.downcase!}

  def has_votes?
    self.open_votes != 0
  end

  def refresh_votes
    self.update_attribute(:open_votes, 3) if stale?
  end

  def upvote!(topic)
    self.votes.create(:topic => topic, :active => true)
    tick_votes(-1)
    topic.update_vote_data
  end

  def downvote!(topic)
    vote = self.votes.where(:topic_id => topic.id, :active => true).first
    if vote
      vote.deactivate
      tick_votes(1)
      topic.update_vote_data
    end
  end

  def tick_votes(int)
    self.update_attribute(:open_votes, self.open_votes + int)
  end

  def key_attrs
    {name: self.name, open_votes: self.open_votes, topicIds: active_ids,
     group: self.group, cohortId: self.cohort_id}
  end

  def to_json
    self.key_attrs.to_json
  end

  def errors_template
    self.errors.full_messages.map { |msg| {:error => msg} }
  end

  private
  def default_values
    self.open_votes = 3
    self.group = "student"
  end

  def active_ids
    self.votes.where(:active => true).pluck(:topic_id)
  end

  def last_vote
    votes.most_recent
  end

  def stale?
    last_vote.nil? || last_vote.created_at < Time.zone.now.to_date.beginning_of_day
  end
end