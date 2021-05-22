class SearchController < ApplicationController
  def index
    menu = Menu.find_by(name: params[:search])
    redirect_to menu if menu
  end
end
