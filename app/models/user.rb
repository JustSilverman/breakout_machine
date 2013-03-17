class User < ActiveRecord::Base
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  belongs_to :cohort
  has_many :votes
  has_many :topics, :through => :votes

  attr_accessible :name, :email, :password,
                  :password_confirmation, :cohort, :cohort_id
  has_secure_password

  validates_confirmation_of :password
  validates :cohort_id, presence: true
  validates :name, presence: true, length: { maximum: 35 }
  validates :email, presence:   true,
                    format:     { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }
  validates :password, presence: true, length: { minimum: 6 }
  validates :password_confirmation, presence: true

  before_create :default_values
  before_save {self.email.downcase!}

  def has_votes?
    self.open_votes != 0
  end

  def refresh_votes
    self.update_attribute(:open_votes, 3) if stale?
  end

  def tick_votes(int)
    new_votes = self.open_votes + int
    self.update_attribute(:open_votes, new_votes)
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

  def last_vote_date
    self.votes.order("created_at DESC").first.updated_at
  end

  def stale?
    self.votes.count == 0 || last_vote_date > 12.hours.ago
  end
end