class Vote < ActiveRecord::Base
  attr_accessible :active, :user, :topic

  belongs_to :user
  belongs_to :topic

  def deactivate!
    update_attribute(:active, false)
  end

  class << self
    def active
      where(:active => true)
    end

    def by_topic(topic)
      where(:topic_id => topic.id)
    end

    def by_user(user)
      where(:user_id => user.id)
    end

    def most_recent
      order('created_at DESC').limit(1).first
    end

    def active_topic_ids
      active.topic_ids
    end
  end
end
