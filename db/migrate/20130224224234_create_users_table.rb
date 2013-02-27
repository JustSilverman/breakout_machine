class CreateUsersTable < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string  :first_name, :null => false
      t.string  :last_name, :null => false
      t.string  :email, :null => false
      t.string  :type
      t.string  :password_digest
      t.integer :open_votes

      t.timestamps
    end
  end
end
