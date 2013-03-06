class Topic < ActiveRecord::Base
  def self.sort_by_votes
    Topic.all.sort_by { |topic| 1.0 / topic.count }
  end

  UPVOTE_DIR   = "up"
  DOWNVOTE_DIR = "down"

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

  def vote(dir, user_id)
    user = User.find(user_id)
    dir == UPVOTE_DIR ? upvote(user) : downvote(vote, user)
  end

  private
  def upvote(user)
    self.votes.create(:user_id => user.id)
    user.decrement_votes
  end

  def downvote(vote, user)
    vote = Vote.where(:user_id => user.id, :topic_id => self.id).first
    if vote
      vote.deactivate
      user.increment_votes
    end
  end
end
