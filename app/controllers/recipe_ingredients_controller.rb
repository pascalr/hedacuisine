class RecipeIngredientsController < ApplicationController
  before_action :set_recipe
  before_action :set_recipe_ingredient, only: [:update, :destroy, :move]

  def create
    ing = @recipe.recipe_ingredients.build
    ing.food = Food.find_by!(name: params[:food_name])
    ing.assign_attributes(recipe_ingredient_params)
    ing.save!
    respond_to do |format|
      format.js {render json: {id: ing.id, food: {url: food_path(ing.food), name: ing.food.name}, url: recipe_recipe_ingredient_path(@recipe, ing)}}
      format.html {redirect_back fallback_location: recipe_path(@recipe)}
    end
  end

  def move
    @recipe_ingredient.insert_at(params[:item_nb].to_i)
    head :ok
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
      @recipe_ingredient = @recipe.recipe_ingredients.find(params[:id] || params[:recipe_ingredient_id])
    end

    def recipe_ingredient_params
      params.require(:recipe_ingredient).permit(:food_id, :raw, :comment)
    end
end
