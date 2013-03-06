class User < ActiveRecord::Base
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

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

  has_many :votes
  has_many :topics, :through => :votes

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
end
