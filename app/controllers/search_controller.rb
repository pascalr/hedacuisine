class SearchController < ApplicationController
  skip_before_action :authenticate_user!
  skip_before_action :only_admin!
  def index
    menu = Menu.find_by(name: params[:search])
    redirect_to menu if menu
    recipe = Recipe.where('lower(name) = ?', params[:search]).first 
    redirect_to recipe if recipe
    @recipes = Recipe.where("lower(name) like ?", "%#{params[:search]}%")
    @results = @recipes
  end
end
