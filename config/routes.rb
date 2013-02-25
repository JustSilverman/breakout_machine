BreakoutMachine::Application.routes.draw do
  root :to => 'topics#index'

  resources :topics,   only: [:new, :create, :index, :edit, 
                              :update, :destroy, :show]
  resources :users,     only: [:new, :create, :index, :show]
  resources :sessions, only: [:new, :create, :destroy]
end
