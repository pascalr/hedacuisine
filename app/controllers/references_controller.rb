class ReferencesController < ApplicationController
  before_action :set_recipe
  before_action :set_reference, only: [:update, :destroy, :move]

  def create
    reference = @recipe.references.create!(reference_params)
    redirect_back fallback_location: recipe_path(@recipe)
  end

  def update
    @reference.update!(reference_params)
    redirect_back fallback_location: recipe_path(@recipe)
  end

  def destroy
    @reference.destroy!
    redirect_back fallback_location: recipe_path(@recipe)
  end

  private
    
    def set_recipe
      @recipe = current_user.recipes.find(params[:recipe_slug].split('-')[0])
    end

    def set_reference
      @reference = @recipe.references.find(params[:id] || params[:reference_id])
    end

    def reference_params
      params.require(:reference).permit(:raw)
    end
end
