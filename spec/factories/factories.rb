FactoryGirl.define do
  factory :user do
    name                   Faker::Name.name
    sequence(:email)       { |n| "Person@example#{n}.com"}
    password               "foobar"
    password_confirmation  "foobar"
    cohort
  end

  factory :topic do
    title                  Faker::Company.bs.titleize
  end

  factory :vote do
    user
    topic
  end

  factory :cohort do
    name                  "Cohort name"
  end
end
