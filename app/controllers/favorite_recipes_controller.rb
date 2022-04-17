class FavoriteRecipesController < ApplicationController

  before_action :set_favorite_recipe, only: [:update, :destroy, :move]

  def create
    fav = current_user.favorite_recipes.create(favorite_recipe_params)
    respond_to do |format|
      format.json {render json: favorite_recipe_to_obj(fav)}
    end
  end

  def update
    @favorite_recipe.update!(favorite_recipe_params)
    respond_to do |format|
      format.json {render json: to_obj(@favorite_recipe)}
    end
  end

  def destroy
    @favorite_recipe.destroy!
    respond_to do |format|
      format.json {render json: {}}
    end
  end

  private

    def set_favorite_recipe
      @favorite_recipe = current_user.favorite_recipes.find(params[:id] || params[:favorite_recipe_id])
    end

    def favorite_recipe_params
      return {} unless params.key? :favorite_recipe
      params.require(:favorite_recipe).permit(:item_nb, :content, :json, :html)
    end
end
