#def lazy_resources(name)
#  resources name, controller: 'database'
#end

Rails.application.routes.draw do

  #root :to => 'home#index'
  # FIXME: Put this constant somewhere. Don't hard code it.
  root to: redirect("/qc"), as: :redirected_root

  resources :themes, except: [:show] do
    member do
      get 'stylesheet'
    end
  end
  resources :food_tags
  get 'search/index'
  resources :listings
  resources :ingredients
  resources :recipe_steps
  resources :translations
  resources :food_recipes
  resources :tasks
  resources :groups
  get 'stats/index'
  resources :container_formats
  resources :food_preferences
  get 'meta/index'
  resources :units
  devise_for :users
  resources :tools

  get '/robot_home', to: 'home#robot_index', as: 'robot_home'
  
  get 'admin/edit_recipes', to: 'admin#edit_recipes', as: 'admin_edit_recipes'
  get 'admin/test', to: 'admin#test', as: 'admin_test'

  resources :images do
    member do
      patch 'process_image'
      get 'original', defaults: {locale: nil}, as: nil
      get 'thumb', defaults: {locale: nil}, as: nil
      get 'portrait_thumb', defaults: {locale: nil}, as: nil
      get 'small', defaults: {locale: nil}, as: nil
      get 'medium', defaults: {locale: nil}, as: nil
    end
  end

  get 'sitemap', to: "sitemap#index"

  resources :expressions, only: [:index, :create, :update, :destroy, :show]
  resources :machine_users, only: [:create, :update, :destroy, :new]
  resources :food_substitutions, only: [:create, :update, :destroy, :index]
  resources :book_formats, only: [:create, :update, :destroy, :index]

  post 'change_food_tag', to: 'foods#change_tag'

  get 'recipes/visibility'

  resources :sections, only: [:create, :update, :destroy] do
    patch :move
  end
  
  resources :machines do
    get 'get_state', to: 'sim#get_state'
    get 'get_current_user', to: 'sim#get_current_user'
    get 'pull_machine', to: 'sim#pull_machine'
    post 'push_machine', to: 'sim#push_machine'
    post 'push_modifications', to: 'sim#push_modifications'
  
    resources :containers, only: [:index, :create, :update, :destroy, :show]
    resources :machine_foods, only: [:create, :update, :destroy]
    resources :grocery_items, only: [:create, :update, :destroy]
    resources :meals do #, only: [:index, :new, :create, :update, :destroy]
      collection do
        get 'daily'
      end
    end

    member do
      get 'inventory'
      get 'grocery_list'
      get 'grocery_config'
      get 'inventory_config'
    end

    delete 'clear_grocery_items', to: 'grocery_items#clear', as: 'clear_grocery_items'

  end

  get 'ecological', to: 'home#ecological'
  
  get 'article_images/:article_name/:filename/:extension', to: 'article_images#show'

  resources :items, only: [:destroy]
  resources :menus
  #resources :categories, only: [:create, :update, :destroy]
  post 'menus/add_or_create_recipe'

  get 'users/index'
  post 'users/toggle_favorite_menu'
  get 'users/modify' # devise already use edit
  resources 'users', only: [:show] do 
    member do
      patch 'change_to_sibling'
    end
  end
#  post 'users/toggle_favorite_menu'

  resources :descriptions, only: [:create, :update, :destroy]
  resources :recipe_comments, only: [:create, :update, :destroy]
  resources :recipe_ratings, only: [:create]
  delete 'recipe_ratings', to: 'recipe_ratings#destroy'

  localized do
    resources :kinds, param: 'slug'
    resources :foods, param: 'slug'
  
    get 'search/data', as: 'search_data'

    #resources :recipe_kinds, only: [:index, :create, :edit] do
    resources :recipe_kinds, only: [:index, :create, :update, :destroy, :edit, :show, :new] do
      member do
        get 'search_recipe'
      end
    end

    resources :recipes, param: 'slug' do
      
      resources :ingredient_sections, only: [:create, :update, :destroy] do
        patch :move
      end
      resources :recipe_notes, only: [:create, :update, :destroy] do
        patch :move
      end
      resources :recipe_ingredients, only: [:create, :update, :destroy] do
        patch :move
      end
      resources :recipe_tools, only: [:create, :update, :destroy]
      resources :references, only: [:create, :update, :destroy]

      member do
        get 'page'
        get 'old_edit'
        patch 'do_process', param: 'slug'
        patch 'cheat', param: 'slug'
        get 'validate'#, param: 'slug'
        patch 'move_ing', param: 'slug'
        patch 'update_image', param: 'slug'
      end

      collection do
        get 'new_variant'
      end
    end
    get 'my_recipes', to: 'recipes#my_recipes'

    resources :books, param: 'slug' do
      member do
        patch 'on_index_change'
        get 'edit_appearance'
        patch 'set_is_featured'
      end
      resources :book_recipes, only: [:create, :update, :destroy, :show], path: 'recipes', param: 'slug'
      resources :book_sections, only: [:create, :update, :destroy]
      resources :pages, only: [:create, :update, :destroy]
    end
    get 'my_books', to: 'books#my_books'
    
    get 'billing', to: 'billing#index', as: 'billing'

    get '/', to: 'home#index', as: 'home'

    resources :articles, param: 'slug'

  end

end
