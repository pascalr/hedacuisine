class AdminController < ApplicationController
  def index
  end
  def edit_recipes
    @recipes = Recipe.all.order(:name)
    gon.jbuilder
  end
end
