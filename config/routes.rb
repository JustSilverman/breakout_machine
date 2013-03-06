BreakoutMachine::Application.routes.draw do
  resource  :users,     only: [:create, :index, :destroy]
  resources :topics,    only: [:create, :index, :update, :destroy]
  resources :sessions,  only: [:create]
  match '/sessions' => 'sessions#destroy', :via => :delete

  root :to => 'topics#index'
end
