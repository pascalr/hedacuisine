class FoodRecipesController < ApplicationController

  before_action :set_food_recipe, only: %i[ update destroy ]

  #skip_before_action :authenticate_user!, only: [:show]
  #skip_before_action :only_admin!, only: [:show]

  def index
    @food_recipes = FoodRecipe.all
  end

  def create
    @food_recipe = FoodRecipe.new(food_recipe_params)

    respond_to do |format|
      if @food_recipe.save
        format.html { redirect_to food_recipes_path, notice: "FoodRecipe was successfully created." }
        format.json { render :show, status: :created, location: @food_recipe }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @food_recipe.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @food_recipe.update(food_recipe_params)
        format.html { redirect_to food_recipes_path, notice: "FoodRecipe was successfully updated." }
        format.json { render :show, status: :ok, location: @food_recipe }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @food_recipe.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @food_recipe.destroy
    respond_to do |format|
      format.html { redirect_to food_recipes_url, notice: "FoodRecipe was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    def set_food_recipe
      @food_recipe = FoodRecipe.find(params[:id])
    end

    def food_recipe_params
      params.require(:food_recipe).permit(:food_id, :recipe_id)
    end
end
