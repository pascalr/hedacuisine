class FilteredRecipesController < ApplicationController

  before_action :set_filtered_recipe, only: [:update, :destroy]

  def missing
    filter_id = params[:recipe_filter_id]
    #current_user.suggestions.where()
    recipes = current_user.recipes.left_outer_joins(:filtered_recipes).where('filtered_recipes.id IS NULL OR filtered_recipes.recipe_filter_id != ?', filter_id)
    recipe_kinds = RecipeKind.left_outer_joins(:filtered_recipes).where('filtered_recipes.id IS NULL OR filtered_recipes.recipe_filter_id != ?', filter_id)
    #recipes = current_user.recipes.left_outer_joins(:filtered_recipes).where(filtered_recipes: {id: nil})
    #recipe_kinds = RecipeKind.left_outer_joins(:filtered_recipes).where(filtered_recipes: {id: nil})
    collections = [recipes, recipe_kinds]
    nbItems = 20 # items per batch
    offset = params[:offset] || 0
    result = paginate_collections(collections, offset, nbItems)
    render json: result.map {|r| r.to_obj(only: [:name, :image_id]) }
  end

  def batch_update
    filter_id = params[:recipe_filter_id]
    data = JSON.parse(params[:data])
    data.each do |d|
      record = FilteredRecipe.new
      record.filterable_type = d["filterable_type"].camelcase
      record.filterable_id = d["filterable_id"]
      record.recipe_filter_id = filter_id
      record.match = !!d["selected"]
      record.save!
    end
  end

  #skip_before_action :authenticate_user!, only: [:test]
  #skip_before_action :only_admin!, only: [:test]
  def create
    r = current_user.filtered_recipes.create!
    render json: r.to_obj
  end

  def update
    @filtered_recipe.update!(filtered_recipe_params)
    respond_to do |format|
      format.json {render json: @filtered_recipe.to_obj}
    end
  end

  def destroy
    @filtered_recipe.destroy!
    respond_to do |format|
      format.json {render json: {}}
    end
  end
private
    def set_filtered_recipe
      @filtered_recipe = FilteredRecipe.find(params[:id])
      belongs_to_user = @filtered_recipe.recipe_filter.user_id == current_user.id
      raise "not allowed" unless  belongs_to_user || (current_user_admin? && @filtered_recipe.recipe_filter.user_id.blank?)
    end
    def filtered_recipe_params
      params.require(:filtered_recipe).permit(:name, :image_src)
    end
end
