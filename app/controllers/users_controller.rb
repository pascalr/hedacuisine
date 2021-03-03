class UsersController < ApplicationController
  skip_before_action :only_admin!, only: [:toggle_favorite_menu]
  def toggle_favorite_menu
    @menu = Menu.find(params[:menu_id])
    fav_menu = FavoriteMenu.find_by(menu_id: @menu.id, user_id: current_user.id)
    if fav_menu
      fav_menu.destroy!
      redirect_to request.referrer
    else
      FavoriteMenu.create!(menu_id: @menu.id, user_id: current_user.id)
      redirect_to request.referrer
    end
  end
end
