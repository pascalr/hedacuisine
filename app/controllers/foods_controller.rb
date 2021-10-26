class FoodsController < ApplicationController
  before_action :set_food, only: %i[ show edit update destroy ]
  skip_before_action :authenticate_user!, only: [:show]

  def new
    @food = Food.new
  end

  def show
    @recipes = @food.recipes.all_public.all_main.with_images
  end
  
  def edit
  end

  def change_tag
    @food = Food.find(params[:food_id])
    @food.food_tag = FoodTag.find(params[:food_tag_id])
    @food.save!
    redirect_to @food.tag
  end

  def index
    @foods = Food.all.sort_by(&:name)
  end

  def create
    @food = Food.new(food_params)
    @food.save!
    redirect_to foods_path
  end

  def update
    @food.update!(food_params)
    @food.recipe_ingredients.all.each do |ing|
      ing.refresh_weight
      ing.save!
    end
    redirect_to foods_path
  end

  def destroy
    @food.destroy
    redirect_to foods_path
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_food
      @food = Food.find(params[:slug].split('-')[0])
    end

    # Only allow a list of trusted parameters through.
    def food_params
      params.require(:food).permit(:name, :density, :unit_weight, :color, :is_liquid, :color_string, :plural, :in_pantry, :food_tag_id)
    end
end
