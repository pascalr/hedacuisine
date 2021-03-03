class UnitsController < ApplicationController
  before_action :set_unit, only: %i[ show edit update destroy ]

  # GET /units or /units.json
  def index
    @units = Unit.all
  end

  def create
    @unit = Unit.new(unit_params)
    @unit.save!
    redirect_to units_path
  end

  def update
    @unit.update!(unit_params)
    redirect_to units_path
  end

  def destroy
    @unit.destroy
    redirect_to units_path
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_unit
      @unit = Unit.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def unit_params
      params.require(:unit).permit(:name, :value, :is_weight, :is_volume, :show_fraction, :language_id)
    end
end
