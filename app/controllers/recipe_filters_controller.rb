class RecipeFiltersController < ApplicationController

  before_action :set_recipe_filter, only: [:update, :destroy]

  def all_recipe_kinds
    filter = RecipeFilter.find(params[:recipe_filter_id])
    filtered_recipes = filter.filtered_recipes.where(filterable_type: 'RecipeKind')
    filtered_recipes_by_recipe_kind_id = filtered_recipes.inject({}) {|acc, r| acc[r.filterable_id] = r; acc}
    recipe_kinds = RecipeKind.all
    groups = {unkown: [], matching: [], not_matching: []}
    recipe_kinds.map {|k|
      o = k.to_obj(only: [:name, :image_id])
      f = filtered_recipes_by_recipe_kind_id[k.id]
      #o[:score] = suggestion.score
      if f && f.match
        groups[:matching] << o
      elsif f
        groups[:not_matching] << o
      else 
        groups[:unkown] << o
      end
    }
    render json: groups
  end

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
