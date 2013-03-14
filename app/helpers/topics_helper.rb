module TopicsHelper
  def list_title(cohort)
    cohort ? "#{cohort.name.titleize}' Topics" : "Topics for All Cohorts"
  end
end
