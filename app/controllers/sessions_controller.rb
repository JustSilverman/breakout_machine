class SessionsController < ApplicationController
  def create
    @user = User.find_by_email(params[:email].downcase)
     if @user && @user.authenticate(params[:password])
      sign_in @user
      @message = "Welcome #{@user.first_name}"
    else
      @message = "Invalid credentials"
    end

    render :json => { :profile => render_to_string('shared/_profile', :layout => false) }
  end

  def destroy
    sign_out
    redirect_to root_url
  end
end
