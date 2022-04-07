class RecipeFiltersController < ApplicationController
  #skip_before_action :authenticate_user!, only: [:test]
  #skip_before_action :only_admin!, only: [:test]
  def create
    r = current_user.recipe_filters.create
    render json: r.to_obj
  end
end
