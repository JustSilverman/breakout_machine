class AddActiveVoteCountLastUpvoteDateToTopics < ActiveRecord::Migration
  def change
    add_column :topics, :active_vote_count, :integer, :null => false, :default => 0
    add_column :topics, :last_upvote_date,  :datetime

    Topic.all.each do |topic|
      last_upvote = Vote.where(:topic => topic, :active => true).
                        order(:updated_at).limit(1).first
      upvote_date = last_upvote ? last_upvote.created_at : nil

      topic.update_attributes(:active_vote_count => topic.active_votes.count,
                              :last_upvote_date  => upvote_date)
    end
  end
end
