class UsersController < ApplicationController
  def create
    @user = User.new(params[:user])
    if @user.save
      sign_in @user
      render :json => @user.to_json
    else
      render :json => {message: "We've got some errors", errors: @user.errors_template}
    end
  end
end
