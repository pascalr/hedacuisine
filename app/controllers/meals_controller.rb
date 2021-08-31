class MealsController < ApplicationController
  before_action :set_machine
  before_action :set_meal, only: [:update, :destroy]
  #skip_before_action :only_admin!
  
  def index
    @meals = @machine.meals.includes(:recipe)
  end

  def new
    @meal = Meal.new
  end

  def daily
    @day = DateTime.new(params[:year].to_i, params[:month].to_i, params[:day].to_i, 0, 0, 0)
    @next_day = @day + 1.day
    @meals = Meal.where(start_time: @day..@next_day)
  end

  def create
    meal = @machine.meals.build(meal_params)
    meal.recipe = Recipe.find(params[:meal][:recipe_id])
    t = meal.start_time
    meal.start_time = DateTime.new(params[:year].to_i, params[:month].to_i, params[:day].to_i, t.hour, t.min, t.sec, t.zone)
    meal.save!
    redirect_back fallback_location: machine_meals_path(@machine)
    #redirect_to machine_meals_path(@machine)
  end

  def update
    @meal.update!(meal_params)
    redirect_back fallback_location: machine_meals_path(@machine)
    #redirect_to machine_meals_path(@machine)
  end

  def destroy
    @meal.destroy!
    redirect_back fallback_location: machine_meals_path(@machine)
    #redirect_to machine_meals_path(@machine)
  end

  private
    
    def set_machine
      @machine = current_user.machines.find(params[:machine_id])
    end

    def set_meal
      @meal = @machine.meals.find(params[:id])
    end

    def meal_params
      params.require(:meal).permit(:is_done, :start_time, :end_time)
    end
end
