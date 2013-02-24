class CreateTopicsTable < ActiveRecord::Migration
  def change
    create_table :topics do |t|
      t.string :title
      t.boolean :completed

      t.timestamps
    end
  end
end
