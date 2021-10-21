class RecipeToolsController < ApplicationController
  before_action :set_recipe
  before_action :set_recipe_tool, only: [:update, :destroy, :move]

  def create
    recipe_tool = @recipe.recipe_tools.create!(recipe_tool_params)
    redirect_back fallback_location: recipe_path(@recipe)
  end

  def update
    @recipe_tool.update!(recipe_tool_params)
    redirect_back fallback_location: recipe_path(@recipe)
  end

  def destroy
    @recipe_tool.destroy!
    redirect_back fallback_location: recipe_path(@recipe)
  end

  private
    
    def set_recipe
      @recipe = Recipe.find(params[:recipe_slug].split('-')[0])
    end

    def set_recipe_tool
      @recipe_tool = @recipe.recipe_tools.find(params[:id] || params[:recipe_tool_id])
    end

    def recipe_tool_params
      params.require(:recipe_tool).permit(:tool_id)
    end
end
