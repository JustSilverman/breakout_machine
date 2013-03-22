require 'spec_helper'

describe User do
  context '#valid?' do
    it { should validate_presence_of(:email) }
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:password) }
    it { should validate_presence_of(:password_confirmation) }
    it { should validate_presence_of(:cohort_id) }
    it { should_not allow_value("blah").for(:email) }
    it { should allow_value("a@b.com").for(:email) }

    context '#valid? where existing user is necessary' do
      before { create(:user) }
      it { should validate_uniqueness_of(:email) }
    end
  end

  context 'associations' do
    it { should have_many(:votes) }
    it { should have_many(:topics).through(:votes) }
    it { should belong_to(:cohort) }
  end

  context 'mass assigment' do
    it { should allow_mass_assignment_of(:email) }
    it { should allow_mass_assignment_of(:name) }
    it { should allow_mass_assignment_of(:password) }
    it { should allow_mass_assignment_of(:password_confirmation) }
    it { should allow_mass_assignment_of(:cohort_id) }
  end

end
