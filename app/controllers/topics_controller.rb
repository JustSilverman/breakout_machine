class TopicsController < ApplicationController
  def index
    @topics = Topic.all
  end

  def create
    @topic = Topic.new(:title => params[:title])

    save_and_render(@topic)
  end

  def update
    redirect_to root_path unless current_user.has_votes?
    @topic = Topic.find(params[:id])

    save_and_render(@topic)
  end

  def destroy
    @topic = Topic.find(params[:id])
    @topic.destroy
    redirect_to 'index'
  end
end

private
def save_and_render(topic)
  topic.save

  respond_to do |format|
    format.html { redirect_to 'index'}
    format.json { render :json => topic }
  end
end