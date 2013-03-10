class User < ActiveRecord::Base
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  has_many :votes
  has_many :topics, :through => :votes

  attr_accessible :name, :email, :password,
                  :password_confirmation
  has_secure_password

  validates_confirmation_of :password
  validates :name, presence: true, length: { maximum: 35 }

  validates :email, presence:   true,
                    format:     { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }
  validates :password, presence: true, length: { minimum: 6 }
  validates :password_confirmation, presence: true
  before_create :default_values

  before_save {self.email.downcase!}

  def first_name
    self.name.split(" ").first
  end

  def last_name
    self.name.split(" ").last
  end

  def has_votes?
    self.open_votes != 0
  end

  def decrement_votes
    self.update_attribute(:open_votes, self.open_votes -= 1)
  end

  def increment_votes
    self.update_attribute(:open_votes, self.open_votes += 1)
  end

  def refresh_votes
    if last_vote_date > 12.hours.ago || self.votes.count == 0
      self.update_attribute(:open_votes, 3)
    end
  end

  def key_attrs
    {name: self.name, open_votes: self.open_votes, topic_ids: active_ids,
     group: self.group}
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
    Vote.select(:topic_id).
         where(:user_id => self.id, :active => true).
         map {|topic| topic.topic_id }
  end

  def last_vote_date
    Vote.where(:user_id => self.id).order("created_at DESC").first.updated_at
  end
end
