class Topic < ActiveRecord::Base
  attr_accessible :title
  has_many :votes
  has_many :users, :through => votes

  def complete?
    self.complete
  end

  def completed!
    self.update_attributes(:completed => true)
  end
end
