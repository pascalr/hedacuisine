class RecipeIngredientsController < ApplicationController
  before_action :set_recipe
  before_action :set_recipe_ingredient, only: [:update, :destroy]

  def create
    recipe_ingredient = @recipe.recipe_ingredients.build(recipe_ingredient_params)
    recipe_ingredient.item_nb = (@recipe.recipe_ingredients.maximum(:item_nb) || 0) + 1
    recipe_ingredient.save!
    redirect_back fallback_location: recipe_path(@recipe)
  end

  def update
    @recipe_ingredient.update!(recipe_ingredient_params)
    redirect_back fallback_location: recipe_path(@recipe)
  end

  def destroy
    @recipe_ingredient.destroy!
    redirect_back fallback_location: recipe_path(@recipe)
  end

  private
    
    def set_recipe
      @recipe = Recipe.find(params[:recipe_slug].split('-')[0])
    end

    def set_recipe_ingredient
      @recipe_ingredient = @recipe.recipe_ingredients.find(params[:id])
    end

    def recipe_ingredient_params
      params.require(:recipe_ingredient).permit(:food_id, :raw_quantity)
    end
end
