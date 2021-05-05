def lazy_resources(name)
  resources name, controller: 'database'
end

Rails.application.routes.draw do

  resources :listings
  resources :tasks
  resources :groups
  get 'stats/index'
  resources :container_formats
  resources :food_preferences
  resources :foods
  get 'meta/index'
  resources :units
  devise_for :users

  get 'home', to: 'home#index'
  
  get 'article_images/:article_name/:filename/:extension', to: 'article_images#show'

  resources :items, only: [:destroy]
  resources :menus
  resources :categories, only: [:create, :update, :destroy]
  post 'menus/add_or_create_recipe'

  post 'users/toggle_favorite_menu'
  get 'users/modify' # devise already use edit
#  resources 'users', only: [:edit]
#  post 'users/toggle_favorite_menu'

  resources :descriptions, only: [:create, :update, :destroy]
  resources :recipes, param: 'slug' do
    member do
      patch 'do_process', param: 'slug'
      patch 'cheat', param: 'slug'
    end
  end
  resources :recipe_comments, only: [:create, :update, :destroy]
  resources :recipe_ratings, only: [:create]
  delete 'recipe_ratings', to: 'recipe_ratings#destroy'

  root :to => 'home#index'
#  resources :sections
#  resources :menus
#  resources :mesh_objs
#  resources :translations
#  resources :languages
#  resources :hooks
#  resources :real_objects
#  get 'image/show_detected_image', to: 'images#show_detected_image', as: 'show_detected_image'
#  resources :texts
#  resources :tag_orders
#  #get '/images/:recipe_id', to: 'image#show'
# 
#  # FIXME: These should be nested resources, or maybe it does not matter
#  resources :menu_items, only: [:create, :destroy]
#  resources :recipe_images, only: [:create, :destroy]
#  
#  post 'heda/change_color'
#  post 'heda/change_speed'
#  post 'heda/ask_state'
#  post 'heda/pause'
#  post 'heda/reset'
#  post 'heda/resume'
#  post 'heda/stop'
#  post 'heda/meta_execute'
#  post 'heda/cook_recipe'
#  post 'heda/take_screenshot'
#  post 'heda/seed_recipe'
#  post 'heda/process_recipe'
#  post 'heda/validate_action_required'
#  get 'heda/show_state'
#  post 'heda/action_required'
#  post 'heda/update_state'
#  post 'heda/grab_fixed_jar'
#
#  post 'items/add_recipe'
#  post 'recipes/:id/rate', to: 'recipes#rate'
#  
#  lazy_resources :faqs
#  resources :images
#  lazy_resources :heda_jar_locations
#  lazy_resources :jars
#
#  lazy_resources :spoons
#  lazy_resources :locations
#  lazy_resources :jar_formats
#  lazy_resources :shelves
#  lazy_resources :detected_codes
#  resources :meals
#  lazy_resources :recipe_tags
#  lazy_resources :units
#
#  scope "/:locale" do
#  
#    get 'heda/dashboard'
#    get 'heda/debug'
#    get 'heda/manual'
#
#    get '/database', to: 'database#database', as: 'database'
#    post '/db/create_table', to: 'apps#create_table', as: 'db_create_table'
#    post '/db/:model_name/create_column', to: 'apps#create_column', as: 'db_create_column'
#
#    get 'inventory/index'
#    get 'home', to: 'home#index'
#    resources :items, param: 'slug'
#    get 'grocery_list', to: 'meals#grocery_list'
#    get 'admin/toggle_admin'
#    resources :ingredients, param: 'slug'
#
#    #get 'heda/status'
#    #post 'heda/run'
#    #get 'heda/run'
#    #resources :heda, only: [:show]
#
#    get '/robot', to: 'static_pages#robot'
#    get '/application', to: 'static_pages#application'
#    get '/news', to: 'static_pages#news'
#    get '/contact', to: 'static_pages#contact'
#    get '/about', to: 'static_pages#about'
#    post 'recipes/do_process'
#    resources :recipes, param: 'slug'# do
#    #  member do
#    #    patch 'do_process'
#    #  end
#    #end
#    #patch '/recipes/process/:name', to: 'recipes#process_recipe', as: 'process_recipe', param: 'slug'
#    resources :tags
#    #root :to => redirect('recipes'), as: 'locale_root'
#    #root 'recipes#index'
#  end
#  root :to => redirect('/menus')
end
