class RecipeFiltersController < ApplicationController

  before_action :set_recipe_filter, only: [:update, :destroy]

  #skip_before_action :authenticate_user!, only: [:test]
  #skip_before_action :only_admin!, only: [:test]
  def create
    r = current_user.recipe_filters.create!
    render json: r.to_obj
  end

  def update
    @recipe_filter.update!(recipe_filter_params)
    respond_to do |format|
      format.json {render json: @recipe_filter.to_obj}
    end
  end

  def destroy
    @recipe_filter.destroy!
    respond_to do |format|
      format.json {render json: {}}
    end
  end
private
    def set_recipe_filter
      @recipe_filter = current_user.recipe_filters.find(params[:id])
    end
    def recipe_filter_params
      params.require(:recipe_filter).permit(:name, :image_src)
    end
end
