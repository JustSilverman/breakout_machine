require 'spec_helper'

describe User do
  let(:user) { create(:user) }
  context '#valid?' do
    it { should validate_presence_of(:email) }
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:password) }
    it { should validate_presence_of(:password_confirmation) }
    it { should validate_presence_of(:cohort) }
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

  context 'before_create callback methods' do
    context '#default_values' do
      let(:new_user) { User.new :name => "username", :email => "n@email.com",
                            :password => "apples", :password_confirmation => "apples",
                            :cohort => create(:cohort)
                      }

      let(:existing_user) { create(:user, :group => "teacher", :open_votes => 1 )
                 }
      it 'has 3 open votes after being created' do
        expect {
          new_user.save
        }.to change(new_user, :open_votes).to(3)
      end

      it 'is a student after being created' do
        expect {
          new_user.save
        }.to change(new_user, :group).to("student")
      end

      it 'does not reset votes to 3 after being saved' do
        expect {
          existing_user.save
        }.not_to change(existing_user, :open_votes).to(3)
      end

      it 'is not changed back to student after being saved' do
        expect {
          existing_user.save
        }.not_to change(existing_user, :group).to("student")
      end
    end
  end

  context 'before_save callback methods' do
    let(:user) { User.new :name => "username", :email => "N@EmAiL.com",
                          :password => "apples", :password_confirmation => "apples",
                          :cohort => create(:cohort)
                }
    it 'email is downcase after creation' do
      expect {
        user.save
      }.to change(user, :email).to("n@email.com")
    end

    it 'email is downcase after saving' do
      user.save
      user.email = "N@EmAiL.com"
      expect {
        user.save
      }.to change(user, :email).to("n@email.com")
    end
  end

  context '#has_votes?' do
    let(:user_without_votes) { create(:user_without_votes) }

    it 'returns true when a use has votes' do
      user.has_votes?.should be_true
    end

    it 'returns true when a use has votes' do
      user_without_votes.has_votes?.should be_false
    end
  end

  context '#refresh_votes' do
  end

  context '#tick_votes' do
    it 'requires one argument' do
      expect {
        user.tick_votes
      }.to raise_error(ArgumentError)
    end

    it 'raises an error if votes are already 0' do
      3.times { user.tick_votes(-1) }
      expect {
        user.tick_votes(-1)
      }.to raise_error(Exceptions::NoOpenVotesError)
    end

    context "changes user's open_votes by the argument value, positive and negative" do
      it 'increases open_votes if given a positive argument' do
        expect {
          user.tick_votes(1)
        }.to change(user, :open_votes).by(1)
      end

      it 'decreases open_votes if given a negative argument' do
        expect {
          user.tick_votes(-1)
        }.to change(user, :open_votes).by(-1)
      end
    end
  end

  context '#key_attrs' do
    let(:cohort) { create(:cohort) }
    let(:user) { User.create :name => "username", :email => "N@EmAiL.com",
                             :password => "apples", :password_confirmation => "apples",
                             :cohort => cohort }
    let!(:vote1) { create(:vote, :user => user) }
    let!(:vote2) { create(:vote, :user => user) }


    it 'returns topicIds as an empty array if user has no topics' do
      {name: "username", open_votes: 3, topicIds: [],
       group: "student", cohortId: user.cohort.id }
    end

    it 'returns a hash of key attributes' do
      user.key_attrs.should eq({name: "username", open_votes: 3, topicIds: [vote1.topic.id, vote2.topic.id],
                                group: "student", cohortId: user.cohort.id })
    end
  end

  context '#errors_template' do
    let(:invalid_user) { User.new :password => "apples", :password_confirmation => "apples",
                                  :cohort => nil, :name => "", :email => "" }
    it 'returns an empty arrar for valid users' do
      user.errors_template.should eq([])
    end

    it 'returns an array of full_message error key value pairs' do
      invalid_user.valid?
      invalid_user.errors_template.should eq [{:error=>"Cohort can't be blank"}, {:error=>"Name can't be blank"},
                                              {:error=>"Email can't be blank"}, {:error=>"Email is invalid"}]
    end
  end

  context '#upvote!' do
    let(:topic) { create(:topic) }

    it 'requires one topic as an argument' do
      expect {
        user.upvote!
      }.to raise_error(ArgumentError)
    end

    it 'raises an error if user does not have votes' do
      user_without_votes = create(:user_without_votes)
      expect {
        user_without_votes.upvote!(topic)
      }.to raise_error(Exceptions::NoOpenVotesError)
    end

    it "creates a vote" do
      expect {
        user.upvote!(topic)
      }.to change{Vote.count}.by(1)
    end

    it "reduces a user's open_votes by 1" do
      expect {
        user.upvote!(topic)
      }.to change(user, :open_votes).by(-1)
    end

    it "updates the topic's upvote date" do
      expect {
        user.upvote!(topic)
      }.to change(topic, :last_upvote_date)
    end

    it "updates the topic's active vote count" do
      expect {
        user.upvote!(topic)
      }.to change(topic, :active_vote_count).by(1)
    end
  end
end
