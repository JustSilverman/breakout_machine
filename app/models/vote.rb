class Vote < ActiveRecord::Base
  belongs_to :user
  belongs_to :topic

  def deactivate
    self.update_attributes(:active => false)
  end
end
