class UsersController < ApplicationController

  def create
    @user = User.new(params[:user])
    if @user.save
    else
      render 'new'
    end
  end

  def index
  end

  def destroy
  end
end
