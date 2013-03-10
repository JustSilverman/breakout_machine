class TopicsController < ApplicationController
  def index
    @topics    = Topic.with_json_attrs
    respond_to do |format|
      format.html
      format.json { render :json => {:topics => @topics} }
    end
  end

  def create
    @topic = Topic.new(:title => params[:title])
    render :json => @topic.key_attrs.to_json if @topic.save
  end

  def update
    @topic = Topic.find(params[:id])
    if current_user.has_votes? || params[:dir] == "down"
      @topic.vote(params[:dir], current_user.id)
    end
    render :json => {topic: @topic.key_attrs, user: current_user}.to_json
  end

  def complete
    @topic = Topic.find(params[:id])
    render :json => @topic.complete!.to_json
  end
end