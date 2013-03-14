BreakoutMachine::Application.routes.draw do
  resource  :users,     only: [:create]
  resources :topics,    only: [:index, :update, :create]
  resources :sessions,  only: [:create]


  match '/sessions'          => 'sessions#destroy', :via => :delete
  get '/topics/complete/:id' => 'topics#complete',  :via => :put, :as => 'complete_topic'
  get '/topics/:cohort_name' => 'topics#index',     :as => 'cohort_topics'

  root :to => 'topics#index'

end
