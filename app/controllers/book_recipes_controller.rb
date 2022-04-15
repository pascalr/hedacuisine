class BookRecipesController < ApplicationController
  before_action :set_book, except: [:show]
  before_action :set_book_recipe, only: [:update, :destroy]
  skip_before_action :only_admin!, only: [:show]
  skip_before_action :authenticate_account!, only: [:show]

  def create
    book_recipe = @book.book_recipes.create!(book_recipe_params)
    respond_to do |format|
      format.html {redirect_back fallback_location: books_path}
      format.json {render json: to_obj(book_recipe)}
    end
  end

  def show
    @book = Book.where(is_public: true).find(params[:book_slug].split('-')[0])
    @book_recipe = @book.book_recipes.find(params[:slug].split('-')[0])
    @recipe = @book_recipe.recipe
    #gon.recipes_by_section = @book.book_recipes.all.inject({}) {|acc, record| acc[record.book_section_id || 0] = (acc[record.book_section_id || 0]||[])+[to_obj(record)]; acc}
    #gon.book_sections = to_obj(@book.book_sections.order(:position).to_a)
  end

  def update
    @book_recipe.update!(book_recipe_params)
    respond_to do |format|
      format.json {render json: to_obj(@book_recipe)}
      format.html {redirect_back fallback_location: books_path}
    end
  end

  def destroy
    @book_recipe.destroy!
    respond_to do |format|
      format.json {render json: {}}
      format.html {redirect_back fallback_location: books_path}
    end
  end

  private
    
    def set_book
      @book = current_user.books.find(params[:book_slug].split('-')[0])
    end

    def set_book_recipe
      @book_recipe = @book.book_recipes.find(params[:slug].split('-')[0])
    end

    def book_recipe_params
      params.require(:book_recipe).permit(:recipe_id, :book_section_id)
    end
end
