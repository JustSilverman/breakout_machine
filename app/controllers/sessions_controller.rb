class SessionsController < ApplicationController
  def create
    @user = User.find_by_email(params[:user][:email].downcase)
    if @user && @user.authenticate(params[:user][:password])
      sign_in @user
      @user.refresh_votes
      render :json => @user.to_json
    else
      render :json => {message: "Thou shall not pass"}.to_json
    end
  end

  def destroy
    sign_out
    redirect_to root_path
  end
end
