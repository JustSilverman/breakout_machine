class TopicsController < ActionController::Base
  def index
    @topics.all
  end

  def new
    @topic.new
  end

  def create
    @topic.new(params[:topic])
    if @topic.save
      flash.now[:success] = "Congrats #{@topic.title} has been created"
      redirect_to topics_index_path
    else
      render 'index'
  end

  def show
    @topic = Topic.find(params[:id])
  end
end
