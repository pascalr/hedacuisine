class AdminController < ApplicationController
  skip_before_action :authenticate_user!, only: [:test]
  skip_before_action :only_admin!, only: [:test]
  def index
  end
  def edit_recipes
    @recipes = Recipe.all.order(:name)
    gon.jbuilder
  end
  def test
  end
end
