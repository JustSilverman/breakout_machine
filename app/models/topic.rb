class Topic < ActiveRecord::Base
  attr_accessible :title

  has_many :votes
  has_many :users, :through => :votes

  validates :title, :presence => true

  before_create { self.completed = 0 }

  def completed?
    self.completed
  end

  def complete!
    self.update_attribute(:completed, true)
  end
end
