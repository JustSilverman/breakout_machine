puts "creating users..."
50.times do 
  User.create :first_name              => Faker::Name.first_name,
              :last_name               => Faker::Name.first_name,
              :email                   => "Person@email#{rand(1..1000)}.com",
              :password                => "password",
              :password_confirmation   => "password"
end

puts "creating topics..."
10.times do 
  Topic.create :title => Faker::Company.bs
end

puts "voting for topics"
all_topics = Topic.all
all_users  = User.all

25.times do 
  all_topics.sample.upvote(all_users.sample.id)
end
