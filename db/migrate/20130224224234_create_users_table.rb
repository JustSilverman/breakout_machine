class CreateUsersTable < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string  :name, :null => false
      t.string  :email, :null => false
      t.string  :group
      t.string  :password_digest
      t.integer :open_votes

      t.timestamps
    end
  end
end
