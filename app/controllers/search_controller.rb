class SearchController < ApplicationController
  skip_before_action :authenticate_user!
  skip_before_action :only_admin!
  def index
    @recipes = Recipe.where("lower(name) like ?", "%#{params[:search]}%")
    @results = @recipes
  end
end
