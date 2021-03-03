class UnitSystemItemsController < ApplicationController

  def create
    @unit_system_item = UnitSystemItem.new(unit_system_item_params)
    @unit_system_item.save!
    redirect_to unit_systems_path
  end

  def destroy
    @unit_system_item = UnitSystemItem.find(params[:id])
    @unit_system_item.destroy
    redirect_to unit_systems_path
  end

  private

    # Only allow a list of trusted parameters through.
    def unit_system_item_params
      params.require(:unit_system_item).permit(:unit_id, :unit_system_id)
    end
end
