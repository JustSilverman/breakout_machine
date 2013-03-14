namespace :db do
  desc "Populate db with cohorts"
  task cohorts: :environment do
    Cohort.create :name => "Sea Lions"
    Cohort.create :name => "Banana Slugs"
    Cohort.create :name => "Golden Bears"
  end
end