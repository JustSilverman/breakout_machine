class TopicsController < ActionController::Base
  def index
    @topics = Topic.all
  end

  def new
    @topic = Topic.new
  end

  def create
    @topic = Topic.new(params[:topic])
    if @topic.save
      flash.now[:success] = "Congrats #{@topic.title} has been created"
      redirect_to topics_index_path
    else
      render 'index'
    end
  end

  def show
    @topic = Topic.find(params[:id])
  end
end
