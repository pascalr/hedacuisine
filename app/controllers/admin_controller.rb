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
  def get_editor_json
    if params[:model] == "recipes"
      #render json: Recipe.all_public
    elsif params[:model] == "recipe_kinds"
      render json: RecipeKind.all.map {|r| r.to_obj(only: :description_json)}
    end
  end
end
