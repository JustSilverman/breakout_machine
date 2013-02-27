module TopicsHelper
  def formatted_date(date)
    "(created on #{date.strftime("%m-%d-%Y")})"
  end
end
