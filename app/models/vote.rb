class Vote < ActiveRecord::Base
  attr_accessible :user_id, :topic_id, :active

  belongs_to :user
  belongs_to :topic

  def deactivate
    self.update_attributes(:active => false)
  end
end
