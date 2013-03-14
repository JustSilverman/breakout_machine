class AddCohortIdToUsers < ActiveRecord::Migration
  def change
    add_column :users,  :cohort_id, :integer
    add_column :topics, :cohort_id, :integer
  end
end
