class BooksController < ApplicationController
  before_action :set_book, only: %i[ edit update destroy on_index_change edit_appearance move_book_recipe]
  skip_before_action :authenticate_user!, only: [:index, :show]
  skip_before_action :only_admin!, only: [:index, :show]

  def on_index_change
    items = (@book.book_sections+@book.book_recipes).sort_by(&:position)
    reorderedItem = items.delete_at(params[:source_index].to_i)
    items.insert(params[:destination_index].to_i, reorderedItem)
    items.each_with_index do |item, i|
      item.update!(position: i+1) if item.position != i+1
    end
    head :no_content
  end

  def move_book_recipe
    book_recipe = @book.book_recipes.find(params[:moved_id])
    book_recipe.insert_at(params[:position].to_i)
    head :ok
  end

  def show
    @book = Book.includes([{book_recipes: :recipe}, :book_sections]).find(params[:slug].split('-')[0])
  end
  
  def edit
    gon.jbuilder
  end

  def edit_appearance
    gon.jbuilder
  end

  def set_is_featured
    @book = Book.find(params[:slug].split('-')[0])
    @book.update! is_featured: params[:is_featured]
    redirect_to @book
  end

  def new
    #@themes = Theme.all
    @book = Book.new
  end

  def index
    @books = Book.all_featured.order(:name)
  end

  def my_books
    @books = current_user.books.order(:name)
  end

  def create
    @book = current_user.books.create!(book_params)
    redirect_to edit_book_path(@book)
  end

  def update
    @book.update!(book_params)
    redirect_to @book
  end

  def destroy
    @book.destroy
    redirect_to books_path
  end

  private
    def set_book
      @book = current_user.books.find(params[:slug].split('-')[0])
    end

    def book_params
      params.require(:book).permit(:name, :theme_id, :is_public, :json, :html, :book_format_id, :front_page_image_id, :front_page_text_color, :hide_front_page_text, :background_color, :description_json, :description_html)
    end
end
