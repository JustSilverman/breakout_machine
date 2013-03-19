class Topic < ActiveRecord::Base
  belongs_to :cohort
  has_many :votes, :autosave => true
  has_many :users, :through => :votes

  attr_accessible :title, :cohort, :active_vote_count, :last_upvote_date

  validates :title, :presence => true

  before_create { self.completed = 0 }
  before_save   { self.title.titleize }

  def self.sort_by_votes(cohort)
    ids = cohort ? cohort.id : Cohort.pluck(:id)

    Topic.where(:completed => false, :cohort_id => ids).
          includes(:cohort)
  end

  def self.with_json_attrs(cohort)
    Topic.sort_by_votes(cohort).map(&:key_attrs)
  end

  def completed?
    self.completed
  end

  def complete!
    self.update_attribute(:completed, true)
  end

  def active_votes
    self.votes.where(:active => true)
  end

  def update_vote_data
    last_upvote = self.votes.where(:active => true).order(:updated_at).limit(1).first
    upvote_date = last_upvote ? last_upvote.created_at : nil

    self.update_attributes(:active_vote_count => self.active_votes.size,
                           :last_upvote_date  => upvote_date)
  end

  def key_attrs
    {id: self.id, title: self.title, votes: self.active_vote_count,
     createdAt: self.created_at.strftime("%m-%d-%Y"),
     lastVote: clean_upvote_date, cohortId: self.cohort_id,
     cohortName: self.cohort.name}
  end

  private
  def clean_upvote_date
    DateTime.parse(self.last_upvote_date).strftime("%m-%d-%Y") if self.last_upvote_date
  end
end