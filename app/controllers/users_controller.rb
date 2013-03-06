class UsersController < ApplicationController
  def create
    @user = User.new(params[:user])
    sign_in @user if @user.save
  end

  def index
  end

  def destroy
  end
end
