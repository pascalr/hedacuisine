class SearchController < ApplicationController
  skip_before_action :authenticate_user!
  skip_before_action :only_admin!
  def index
    @foods= Food.where("lower(name) like ? OR lower(plural) like ?", "%#{params[:search]}%", "%#{params[:search]}%")
    @recipes = Recipe.where("lower(name) like ?", "%#{params[:search]}%")
    @results = @recipes + @foods
  end
end
