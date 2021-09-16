class FoodSubstitutionsController < ApplicationController
  before_action :set_food_substitution, only: [:show, :update, :destroy]

  def index
    @foods = Food.all
    @food_substitutions = FoodSubstitution.all
  end

  def create
    food_substitution = FoodSubstitution.create!(food_substitution_params)
    redirect_back fallback_location: food_substitution_path(food_substitution)
  end

  def update
    @food_substitution.update!(food_substitution_params)
    redirect_back fallback_location: food_substitution_path(@food_substitution)
  end

  def destroy
    @food_substitution.destroy!
    redirect_back fallback_location: food_substitutions_path
  end

private
  
  def set_food_substitution
    @food_substitution = FoodSubstitution.find(params[:id])
  end
    
  def food_substitution_params
    params.require(:food_substitution).permit(:food_id, :substitute_id, :ratio, :food_name, :substitute_name, :ratio_with_colon)
  end
end
