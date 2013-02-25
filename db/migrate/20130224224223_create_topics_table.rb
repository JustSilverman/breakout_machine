class CreateTopicsTable < ActiveRecord::Migration
  def change
    create_table :topics do |t|
      t.string  :title
      t.integer :completed, :default => 0, :null => false

      t.timestamps
    end
  end
end
