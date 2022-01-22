class UserRecipeCategoriesController < ApplicationController
  before_action :set_user_recipe_category, only: [:update, :destroy]
  skip_before_action :only_admin!

  def index
  end

  def create
    current_user.user_recipe_categories.create!(user_recipe_category_params)
    redirect_back fallback_location: user_recipes_path
  end

  def update
    @user_recipe_category.update!(user_recipe_category_params)
    redirect_back fallback_location: user_recipes_path
  end

  def destroy
    @user_recipe_category.destroy!
    redirect_back fallback_location: user_recipes_path
  end

  private

    def set_user_recipe_category
      @user_recipe_category = current_user.user_recipe_categories.find(params[:id])
    end

    def user_recipe_category_params
      params.require(:user_recipe_category).permit(:name)
    end
end
