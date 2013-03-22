require 'spec_helper'

describe Topic do
  before do
    @topic = Topic.new(:title =>  "Rails validations")
 end

  subject { @topic }
  
  it { should respond_to(:title) }
  it { should respond_to(:votes) }
  it { should respond_to(:completed) }
  it { should respond_to(:completed?) }
  it { should respond_to(:complete!) }
  it { should respond_to(:count) }
  it { should respond_to(:upvote) }
  it { should respond_to(:downvote) }

  it { should be_valid }

  describe "Title should not be able to be blank" do
    before { @topic.title = "" }
    it { should_not be_valid }
  end

  describe "Should be know its completion status" do
    it "should be incomplete by default" do 
      @topic.save
      @topic.reload.completed?.should == false
    end

    it "should be able to be completed" do 
      @topic.save
      @topic.complete!
      @topic.reload.completed?.should == true
    end
  end
end
