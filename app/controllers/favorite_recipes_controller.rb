class FavoriteRecipesController < ApplicationController

  before_action :set_favorite_recipe, only: [:update, :destroy, :move]

  def create
    fav = current_user.favorite_recipes.create!(recipe_id: params[:recipe_id])
    respond_to do |format|
      format.json {render json: favorite_recipe_to_obj(fav)}
      format.html {redirect_back fallback_location: recipe_path(fav.recipe)}
    end
  end

  def update
    @favorite_recipe.update!(favorite_recipe_params)
    respond_to do |format|
      format.json {render json: @favorite_recipe.to_obj}
    end
  end

  def destroy
    @favorite_recipe.destroy!
    respond_to do |format|
      format.json {render json: {}}
      format.html {redirect_back fallback_location: recipe_path(@favorite_recipe.recipe)}
    end
  end

  private
    def favorite_recipe_params 
      params.require(:favorite_recipe).permit(:list_id)
    end

    def set_favorite_recipe
      @favorite_recipe = current_user.favorite_recipes.find(params[:id] || params[:favorite_recipe_id])
    end
end
