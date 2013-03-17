class TopicsController < ApplicationController
  before_filter :find_topic,   :only => [:update, :complete]
  before_filter :find_cohort,  :only => [:index]

  def index
    @topics = Topic.with_json_attrs(@cohort)

    respond_to do |format|
      format.html
      format.json { render :json => {:topics => @topics} }
    end
  end

  def create
    @topic        = Topic.new(params[:topic])
    @topic.cohort = current_user.cohort

    render :json => @topic.key_attrs if @topic.save
  end

  def update
    current_user.send(params[:operation], @topic)

    render :json => {topic: @topic.key_attrs, user: current_user.key_attrs}
  end

  def complete
    render :json => @topic.complete!
  end

  private
  def find_topic
    @topic = Topic.find(params[:id])
  end

  def find_cohort
    cohort_name = params[:cohort_name].gsub!(/_/, " ") if params[:cohort_name]
    @cohort = Cohort.find_by_name(cohort_name)
  end
end

