class UsersController < ApplicationController

  def new
    redirect_to root_path, notice: "You're already signed in." if signed_in?
    @user = User.new
  end

  def create
    redirect_to current_user if signed_in?

    @user = User.new(params[:user])
    if @user.save
      flash[:success] = "Thanks for signing up."
      redirect_to root_path
    else
      render 'new'
    end
  end

  def index
  end
end
