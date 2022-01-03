class BooksController < ApplicationController
  before_action :set_book, only: %i[ edit update destroy on_index_change]
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

  #def on_index_change
  #  items = @book.book_sections+@book.book_recipes
  #  # First make sure every item has a position
  #  position = items.map(&:position).compact.max
  #  items.each do |item|
  #    unless item.position
  #      # I will base myself on sortablejs and start position at 1 instead of 0.
  #      position = position.nil? ? 1 : position+1
  #      item.update!(position: position)
  #    end
  #  end
  #  head :no_content
  #end

  #def on_index_change
  #  items = @book.book_sections.includes(:order)+@book.book_recipes.includes(:order)
  #  position = items.map(&:order).compact.map(&:position).max
  #  # First make sure every item has an order object
  #  items.each do |item|
  #    unless item.order
  #      position += 1
  #      item.create_order(position: position)
  #    end
  #  end
  #  orders = items.map(&:order)
  #  head :no_content
  #end

  def show
    @book = Book.find(params[:slug].split('-')[0])
  end
  
  def edit
    @theme = @book.theme
    @recipes_html = {}
    @book.recipes.each do |recipe|
      @recipes_html[recipe.id] = render_to_string partial: "recipes/recipe_page", locals: {recipe: recipe}
    end
    gon.jbuilder
  end

  def new
    @themes = Theme.all
    @book = Book.new
  end

  def index
    @books = Book.all_public.order(:name)
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
      params.require(:book).permit(:name, :theme_id, :is_public)
    end
end
