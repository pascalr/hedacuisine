class RecipeIngredientsController < ApplicationController
  before_action :set_recipe
  before_action :set_recipe_ingredient, only: [:update, :destroy, :move]

  def create
    ing = @recipe.recipe_ingredients.create!(recipe_ingredient_params)
    #ing = @recipe.recipe_ingredients.build
    #ing.food = Food.find_by!(name: params[:food_name])
    #ing.assign_attributes(recipe_ingredient_params)
    #ing.save!
    respond_to do |format|
      if ing.food
        format.js {render json: {id: ing.id, raw: ing.raw, name: ing.name, food: {url: food_path(ing.food)}, url: recipe_recipe_ingredient_path(@recipe, ing)}}
      else
        format.js {render json: {id: ing.id, raw: ing.raw, name: ing.name, url: recipe_recipe_ingredient_path(@recipe, ing)}}
      end
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
    respond_to do |format|
      format.json {render json: {}}
      format.html {redirect_back fallback_location: recipe_path(@recipe)}
    end
  end

  private
    
    def set_recipe
      @recipe = Recipe.find(params[:recipe_slug].split('-')[0])
    end

    def set_recipe_ingredient
      @recipe_ingredient = @recipe.recipe_ingredients.find(params[:id] || params[:recipe_ingredient_id])
    end

    def recipe_ingredient_params
      params.require(:recipe_ingredient).permit(:food_id, :raw, :comment, :raw_food, :comment_json, :comment_html)
    end
end
