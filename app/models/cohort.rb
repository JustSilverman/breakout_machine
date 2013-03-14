class Cohort < ActiveRecord::Base
  has_many :users
  has_many :topics

  attr_accessible :name

  before_save { self.name.downcase! }
end