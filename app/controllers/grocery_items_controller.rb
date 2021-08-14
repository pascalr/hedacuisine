class GroceryItemsController < ApplicationController
  before_action :set_machine
  before_action :set_grocery_item, only: [:update, :destroy]
  skip_before_action :only_admin!

  def create
    @machine.grocery_items.create!(grocery_item_params)
    redirect_back fallback_location: machines_path
  end

  def update
    @grocery_item.update!(grocery_item_params)
    redirect_back fallback_location: machines_path
  end

  def destroy
    @grocery_item.destroy!
    redirect_back fallback_location: machines_path
  end

  def clear
    @machine.grocery_items.destroy_all
    redirect_back fallback_location: machines_path
  end

  private
    
    def set_machine
      @machine = current_user.machines.find(params[:machine_id])
    end

    def set_grocery_item
      @grocery_item = @machine.grocery_items.find(params[:id])
    end

    def grocery_item_params
      params.require(:grocery_item).permit(:description)
    end
end
