class MealsController < ApplicationController
  before_action :set_machine
  before_action :set_meal, only: [:update, :destroy]
  #skip_before_action :only_admin!
  
  def index
    @meals = @machine.meals
  end

  def create
    @machine.meals.create!(meal_params)
    redirect_back fallback_location: meals_path
  end

  def update
    @meal.update!(meal_params)
    redirect_back fallback_location: meals_path
  end

  def destroy
    @meal.destroy!
    redirect_back fallback_location: meals_path
  end

  private
    
    def set_machine
      @machine = current_user.machines.find(params[:machine_id])
    end

    def set_meal
      @meal = @machine.meals.find(params[:id])
    end

    def meal_params
      params.require(:meal).permit(:is_done)
    end
end
