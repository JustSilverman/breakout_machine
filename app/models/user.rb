class User < ActiveRecord::Base
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

  attr_accessible :first_name, :last_name, :email, :password,
                  :password_confirmation
  has_secure_password

  validates_confirmation_of :password
  validates :first_name, presence: true, length: { maximum: 35 }
  validates :last_name,  presence: true, length: { maximum: 35 }

  validates :email, presence:   true,
                    format:     { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }
  validates :password, presence: true, length: { minimum: 6 }
  validates :password_confirmation, presence: true

  has_many :votes
  has_many :topics, :through => :votes

  before_save {self.email.downcase!}

  def name
    "#{first_name} #{last_name}"
  end

  def has_votes?
    self.open_votes != 0
  end
end
