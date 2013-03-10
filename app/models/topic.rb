class Topic < ActiveRecord::Base
  UPVOTE_DIR   = "up"
  DOWNVOTE_DIR = "down"

  has_many :votes, :autosave => true
  has_many :users, :through => :votes

  attr_accessible :title

  validates :title, :presence => true

  before_create { self.completed = 0 }
  before_save { self.title.titleize }

  def self.sort_by_votes
    Topic.where(:completed => false).
          sort_by { |topic| 1.0 / topic.active_vote_count }
  end

  def self.with_json_attrs
    Topic.sort_by_votes.map(&:key_attrs)
  end

  def completed?
    self.completed
  end

  def complete!
    self.update_attribute(:completed, true)
  end

  def active_vote_count
    self.active_votes.count
  end

  def active_votes
    Vote.where(:topic_id => self.id, :active => true)
  end

  def vote(dir, user_id)
    user = User.find(user_id)
    dir == UPVOTE_DIR ? upvote(user) : downvote(user)
  end

  def last_upvote
    Vote.where(:topic_id => self.id, :active => true).
         order(:updated_at).limit(1).first
  end

  def last_upvote_date
    self.last_upvote.created_at.strftime("%m-%d-%Y") if self.last_upvote
  end

  def key_attrs
    {id: self.id, title: self.title, votes: self.active_vote_count,
     createdAt: self.created_at.strftime("%m-%d-%Y"),
     lastVote: self.last_upvote_date}
  end

  private
  def upvote(user)
    self.votes.create(:user_id => user.id, :active => true)
    user.decrement_votes
  end

  def downvote(user)
    vote = Vote.where(:user_id => user.id,
                      :topic_id => self.id, :active => true).first
    if vote
      vote.deactivate
      user.increment_votes
    end
  end
end