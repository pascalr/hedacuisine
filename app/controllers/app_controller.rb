class AppController < ApplicationController
  def index
    gon.suggestions = current_user.suggestions.includes(:recipe).map {|s| o = s.to_obj_with_recipe_info}
    gon.current_user_admin = current_user_admin?
    gon.user_tags = current_user.user_tags.order(:position).map {|t| t.to_obj}
    gon.recipe_filters = RecipeFilter.where(user_id: nil).or(current_user.recipe_filters).map {|f| f.to_obj }
    gon.favorite_recipes = current_user.favorite_recipes.includes(:recipe).sort_by {|fav| fav.recipe.name}.map{|fav| fav.to_obj}
    gon.user_recipes = current_user.recipes.order(:name).map {|r| r.to_obj(only: :name)}
    #gon.user_recipes = current_user.recipes.order(:name).map {|r| r.to_obj(only: :name)}
    #gon.favorite_recipes = current_user.favorite_recipes.includes(:recipe).sort_by {|fav| fav.recipe.name}.map {|fav| o = fav.recipe.to_obj(only: :name); o[:fav_id] = fav.id; o}
  end
end
