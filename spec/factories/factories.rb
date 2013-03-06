FactoryGirl.define do
  factory :user do
    name                   Faker::Name.name
    sequence(:email)       { |n| "Person@example#{n}.com"}
    password               "foobar"
    password_confirmation  "foobar"
  end

  factory :topic do
    title                  Faker::Company.bs.titleize
  end

  factory :vote do
    user
    topic
  end
end
