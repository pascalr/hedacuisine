class RecipeKindsController < ApplicationController
  before_action :set_recipe_kind, only: %i[ show edit update destroy ]
  #skip_before_action :authenticate_user!, only: [:show]

  def index
    @recipe_kinds = RecipeKind.all
  end

  def edit
    gon.jbuilder
  end

  def create
    @recipe_kind = RecipeKind.new(recipe_kind_params)
    @recipe_kind.save!
    redirect_to recipe_kinds_path
  end

  def update
    @recipe_kind.update!(recipe_kind_params)
    redirect_to recipe_kinds_path
  end

  def destroy
    @recipe_kind.destroy
    redirect_to recipe_kinds_path
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_recipe_kind
      @recipe_kind = RecipeKind.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def recipe_kind_params
      params.require(:recipe_kind).permit(:name, :description, :image_id)
    end
end
