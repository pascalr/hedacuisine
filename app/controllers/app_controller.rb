class AppController < ApplicationController
  def index
    gon.recipe_filters = RecipeFilter.where(user_id: nil).or(current_user.recipe_filters).map {|f| f.to_obj }
    gon.suggestions = current_user.suggestions.map {|s| o = s.to_obj}
    gon.current_user_admin = current_user_admin?
  end
end
