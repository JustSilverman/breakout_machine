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
              :cohort_id               => all_cohorts.sample.id
end
User.update_all(:open_votes => 15)

puts "creating topics..."
5.times do
  Topic.create :title => Faker::Company.bs, :cohort_id => all_cohorts.sample.id
end

puts "voting for topics"
all_topics = Topic.all
all_users  = User.all

25.times do
  all_topics.sample.vote("up", all_users.sample.id)
end
