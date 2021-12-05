class BookRecipesController < ApplicationController
  before_action :set_book
  before_action :set_book_recipe, only: [:update, :destroy]
  skip_before_action :only_admin!

  def create
    @book.book_recipes.create!(book_recipe_params)
    redirect_back fallback_location: books_path
  end

  def update
    @book_recipe.update!(book_recipe_params)
    redirect_back fallback_location: books_path
  end

  def destroy
    @book_recipe.destroy!
    redirect_back fallback_location: books_path
  end

  private
    
    def set_book
      @book = current_user.books.find(params[:book_id])
    end

    def set_book_recipe
      @book_recipe = @book.book_recipes.find(params[:id])
    end

    def book_recipe_params
      params.require(:book_recipe).permit(:recipe_id)
    end
end
