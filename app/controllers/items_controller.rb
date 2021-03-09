class ItemsController < ApplicationController
  def destroy
    @item = Item.find(params[:id])
    raise "Invalid current user" unless @item.menu.user_id == current_user.id
    @item.destroy!
    redirect_to edit_menu_path(@item.menu)
  end
end
