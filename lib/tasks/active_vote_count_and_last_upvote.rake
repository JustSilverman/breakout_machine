namespace :db do
  desc "Populate active vote count and last upvote date"
  task active_votes_upvote_date: :environment do
    Topic.all.each do |topic|
      last_upvote = Vote.where(:topic_id => topic.id, :active => true).order(:updated_at).limit(1).first
      upvote_date = last_upvote ? last_upvote.created_at : nil

      topic.update_attributes(:active_vote_count => topic.active_votes.count,
                              :last_upvote_date  => upvote_date)
    end
  end
end