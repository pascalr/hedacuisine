class UnitSystemsController < ApplicationController
  before_action :set_unit_system, only: %i[ show edit update destroy ]

  def index
    @units = Unit.order(:name).all # FIXME: Select by language
    @unit_systems = UnitSystem.all
  end

  def create
    @unit_system = UnitSystem.new(unit_system_params)
    @unit_system.save!
    redirect_to unit_systems_path
  end

  def update
    @unit_system.update!(unit_system_params)
    redirect_to unit_systems_path
  end

  def destroy
    @unit_system.destroy
    redirect_to unit_systems_path
  end

  private
    def set_unit_system
      @unit_system = UnitSystem.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def unit_system_params
      params.require(:unit_system).permit(:name)
    end
end
