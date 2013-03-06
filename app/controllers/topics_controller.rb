class TopicsController < ApplicationController
  def index
    @topics = Topic.sort_by_votes
  end

  def create
    @topic = Topic.new(:title => params[:title])

    if @topic.save
      render :json => { :topic_row => render_to_string(:_topic_row,
                                                       :layout => false,
                                                       :locals => {:topic => @topic })}
    else
      render 'index'
    end
  end

  def update
    if current_user.has_votes?
      @topic = Topic.find(params[:id])
      @topic.vote(params[:dir], current_user.id)
      @topics = Topic.sort_by_votes

      render :json => { :table => topics_table_json, :votes => votes_left_json}
    end
  end

  def destroy
    @topic = Topic.find(params[:id])
    @topic.destroy
    redirect_to 'index'
  end

  def topics_table_json
    render_to_string(:_topics_table, :layout => false, :locals => {:topics => @topics })
  end

  def votes_left_json
    render_to_string('shared/_open_votes', :layout => false, :locals => {:current_user => current_user})
  end
end