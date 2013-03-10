BreakoutMachine::Application.routes.draw do
  resource  :users,     only: [:create]
  resources :topics,    only: [:create, :index, :update]
  resources :sessions,  only: [:create]
  match '/sessions' => 'sessions#destroy', :via => :delete
  match '/topics/complete/:id' => 'topics#complete', :via => :put

  root :to => 'topics#index'

end
