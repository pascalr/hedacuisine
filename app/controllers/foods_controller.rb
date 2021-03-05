class FoodsController < ApplicationController
  before_action :set_food, only: %i[ show edit update destroy ]

  def new
    @food = Food.new
  end

  def index
    @foods = Food.all
  end

  def create
    @food = Food.new(food_params)
    @food.save!
    redirect_to foods_path
  end

  def update
    @food.update!(food_params)
    redirect_to foods_path
  end

  def destroy
    @food.destroy
    redirect_to foods_path
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_food
      @food = Food.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def food_params
      params.require(:food).permit(:name, :density, :unit_weight, :color, :is_liquid, :color_string, :plural)
    end
end
