class MachineFoodsController < ApplicationController
  before_action :set_machine
  before_action :set_machine_food, only: [:update, :destroy]
  skip_before_action :only_admin!

  def create
    @machine.machine_foods.create!(machine_food_params)
    redirect_back fallback_location: machines_path
  end

  def update
    @machine_food.update!(machine_food_params)
    redirect_back fallback_location: machines_path
  end

  def destroy
    @machine_food.destroy!
    redirect_back fallback_location: machines_path
  end

  private
    
    def set_machine
      @machine = current_user.machines.find(params[:machine_id])
    end

    def set_machine_food
      @machine_food = @machine.machine_foods.find(params[:id])
    end

    def machine_food_params
      params.require(:machine_food).permit(:food_id, :current_weight, :grocery_threshold, :full_weight, :manual_grocery_threshold, :manual_full_weight)
    end
end
