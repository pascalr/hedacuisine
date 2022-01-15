class BookRecipesController < ApplicationController
  before_action :set_book
  before_action :set_book_recipe, only: [:update, :destroy, :show]
  skip_before_action :only_admin!

  def create
    book_recipe = @book.book_recipes.create!(book_recipe_params)
    respond_to do |format|
      format.html {redirect_back fallback_location: books_path}
      format.js {render json: {book_recipe: {class_name: "book_recipe", id: book_recipe.id, recipe: {id: book_recipe.recipe.id, name: book_recipe.recipe.name}}}}
    end
  end

  def show
    @recipe = @book_recipe.recipe
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
      @book = current_user.books.find(params[:book_slug].split('-')[0])
    end

    def set_book_recipe
      @book_recipe = @book.book_recipes.find(params[:id])
    end

    def book_recipe_params
      params.require(:book_recipe).permit(:recipe_id)
    end
end
