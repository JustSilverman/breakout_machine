FactoryGirl.define do
  factory :user do
    first_name             Faker::Name.first_name
    last_name              Faker::Name.last_name
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
