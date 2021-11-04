class UserRecipesController < ApplicationController
  before_action :set_user_recipe, only: [:update, :destroy]
  skip_before_action :only_admin!
  
  before_action :set_user_recipes, only: [:index, :index_with_pictures, :index_edit, :index_with_details]

  def index
    @recipes = current_user.recipes.paginate(page: params[:page], per_page: 1)
    @recipe = @recipes.first
  end

  def show_recipe_page
    @recipes = current_user.recipes.paginate(page: params[:page], per_page: 1)
    @recipe = @recipes.first
    render partial: "user_recipes/current_page", locals: {recipe: @recipe}, layout: nil
  end

  def index_with_pictures
  end

  def index_edit
  end

  def index_with_details
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

    def set_user_recipes
      @user_recipes_without_category = current_user.user_recipes.where(user_recipe_category_id: nil).includes(user_recipes: :recipe)
      @user_recipe_categories = current_user.user_recipe_categories.includes(user_recipes: :recipe).all
      @halves = @user_recipe_categories.each_slice((@user_recipe_categories.size/2.0).ceil)
      # OPTIMIZE: A smarter division based on the number of recipes. Makes sure the left column
      # always has more recipes than the right column. Take as much categories as needed for that.
      # Inverser les deux colonnes si celle de droite en a plus que celle de gauche?
    end

    def set_user_recipe
      @user_recipe = current_user.user_recipes.find(params[:id])
    end

    def user_recipe_params
      params.require(:user_recipe).permit(:recipe_id, :user_recipe_category_id)
    end
end
