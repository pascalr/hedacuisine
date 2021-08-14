class MachineFoodsController < ApplicationController
  before_action :set_machine_food, only: [:update, :destroy]
  skip_before_action :only_admin!

  def create
    @machine_food = MachineFood.new(machine_food_params)
    @machine_food.save!
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
    # Use callbacks to share common setup or constraints between actions.
    def set_machine_food
      @machine_food = MachineFood.find(params[:id])
      # FIXME: Ensure machine belongs to current user...
    end

    # Only allow a list of trusted parameters through.
    def machine_food_params
      # FIXME: Ensure machine belongs to current user...
      params.require(:machine_food).permit(:food_id, :machine_id, :current_weight, :grocery_threshold, :full_weight, :manual_grocery_threshold, :manual_full_weight)
    end
end
