puts "creating cohorts..."
Cohort.create :name => "Sea Lions"
Cohort.create :name => "Banana Slugs"
Cohort.create :name => "Golden Bears"
all_cohorts = Cohort.all

puts "creating users..."
10.times do
  User.create :name                    => Faker::Name.name,
              :email                   => "Person@email#{rand(1..1000)}.com",
              :password                => "password",
              :password_confirmation   => "password",
              :cohort               => all_cohorts.sample
end
User.update_all(:open_votes => 15)

puts "creating topics..."
5.times do
  Topic.create :title => Faker::Company.bs, :cohort => all_cohorts.sample
end

puts "voting for topics"
all_topics = Topic.all
all_users  = User.all

25.times do
  all_users.sample.send([:upvote!, :downvote!].sample, all_topics.sample)
end
