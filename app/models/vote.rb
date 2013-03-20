class Vote < ActiveRecord::Base
  attr_accessible :active, :user, :topic

  belongs_to :user
  belongs_to :topic


  def deactivate
    self.update_attributes(:active => false)
  end

  def self.active
    where(:active => true)
  end

  def self.most_recent
    order('created_at DESC').limit(1).first
  end

  def self.active_topic_ids
    self.active.topic_ids
  end
end
