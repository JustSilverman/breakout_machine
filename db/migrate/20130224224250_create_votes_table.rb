class CreateVotesTable < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.integer :user_id
      t.integer :topic_id
      t.boolean :active, :default => true
      t.timestamps
    end
  end
end
