class Vote < ActiveRecord::Base
  attr_accessible :active, :user, :topic

  belongs_to :user
  belongs_to :topic

  def deactivate
    self.update_attributes(:active => false)
  end
end
