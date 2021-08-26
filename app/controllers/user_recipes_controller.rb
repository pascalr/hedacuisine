class UserRecipesController < ApplicationController
  before_action :set_user_recipe, only: [:update, :destroy]

  def index
  end

  def create
    current_user.user_recipes.create!(user_recipe_params)
    redirect_back fallback_location: user_recipes_path
  end

  def update
    @user_recipe.update!(user_recipe_params)
    redirect_back fallback_location: user_recipes_path
  end

  def destroy
    @user_recipe.destroy!
    redirect_back fallback_location: user_recipes_path
  end

  private

    def set_user_recipe
      @user_recipe = current_user.user_recipes.find(params[:id])
    end

    def user_recipe_params
      params.require(:user_recipe).permit(:recipe_id, :user_recipe_category_id)
    end
end
