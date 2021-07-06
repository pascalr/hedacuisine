class SearchController < ApplicationController
  skip_before_action :authenticate_user!
  skip_before_action :only_admin!
  def index
    menu = Menu.find_by(name: params[:search])
    redirect_to menu if menu
  end
end
