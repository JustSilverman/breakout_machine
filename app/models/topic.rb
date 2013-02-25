class Topic < ActiveRecord::Base
  attr_accessible :title

  has_many :votes, :autosave => true
  has_many :users, :through => :votes

  validates :title, :presence => true

  before_create { self.completed = 0 }

  def completed?
    self.completed
  end

  def complete!
    self.update_attribute(:completed, true)
  end

  def count
    self.votes.count
  end

  def upvote(user_id)
    self.votes.create(:user_id => user_id)
  end

  def downvote(user_id)
    vote = Vote.where(:user_id => user_id, :topic_id => self.id).first
    vote.deactivate if vote
  end
end
