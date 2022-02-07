class UsersController < ApplicationController

  skip_before_action :only_admin!

  def change_to_sibling
    @sibling = User.find(params[:id])
    raise "Error user is not a sibling!" unless current_user.siblings.include?(@sibling)
    sign_in @sibling
    redirect_back fallback_location: home_path
  end

  def index
  end
  
  def show
    @user = User.find(params[:id])
  end

  def toggle_favorite_menu
    @menu = Menu.find(params[:menu_id])
    fav_menu = FavoriteMenu.find_by(menu_id: @menu.id, user_id: current_user_id)
    if fav_menu
      fav_menu.destroy!
      redirect_to request.referrer
    else
      FavoriteMenu.create!(menu_id: @menu.id, user_id: current_user_id)
      redirect_to request.referrer
    end
  end

  def modify
  end

end
