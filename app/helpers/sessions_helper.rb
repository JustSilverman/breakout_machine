module SessionsHelper
  def sign_in(user)
    cookies[:user_id] = user.id
    self.current_user = user
  end

  def signed_in?
    !current_user.nil?
  end

  def current_user=(user)
    @current_user = user
  end

  def current_user
    User.find_by_id(cookies[:user_id]) if cookies[:user_id]
  end

  def current_user?(user)
    user == current_user
  end

  def sign_out
    self.current_user = nil
    cookies.delete(:user_id)
  end
end
