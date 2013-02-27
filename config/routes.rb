BreakoutMachine::Application.routes.draw do
  root :to => 'topics#index'

  resources :topics,    only: [:create, :index,
                              :update, :destroy]
  resources :users,     only: [:create, :index, :destroy]
  resources :sessions,  only: [:create, :destroy]
end
