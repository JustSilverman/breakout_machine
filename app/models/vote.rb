class Vote < ActiveRecord::Base
  attr_accessible :topic_id, :active, :user

  belongs_to :user
  belongs_to :topic

  def deactivate
    self.update_attributes(:active => false)
  end
end
