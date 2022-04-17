class AppController < ApplicationController
  def index
    gon.recipe_filters = RecipeFilter.where(user_id: nil).or(current_user.recipe_filters).map {|f| f.to_obj }
    gon.current_user_admin = current_user_admin?
  end
end
