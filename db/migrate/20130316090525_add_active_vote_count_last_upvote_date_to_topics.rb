class AddActiveVoteCountLastUpvoteDateToTopics < ActiveRecord::Migration
  def change
    add_column :topics, :active_vote_count, :integer, :null => false, :default => 0
    add_column :topics, :last_upvote_date,  :datetime
  end
end
