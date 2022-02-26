class BooksController < ApplicationController
  before_action :set_book, only: %i[ edit update destroy on_index_change edit_appearance move_book_recipe move_book_section]
  before_action :set_public_book, only: %i[ show search_data ]
  skip_before_action :authenticate_user!, only: [:index, :show, :search_data]
  skip_before_action :only_admin!, only: [:index, :show, :search_data]

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
    book_section = params[:section_id].blank? ? nil : @book.book_sections.find(params[:section_id])
    if book_recipe.book_section != book_section
      book_recipe.update! book_section_id: (book_section ? book_section.id : nil)
      book_recipe.remove_from_list
    end
    book_recipe.insert_at(params[:position].to_i)
    #list = book_recipe.book_section ? book_recipe.book_section.book_recipes : @book.book_recipes
    #insert_sorted_at(list, book_recipe, params[:position].to_i)
    head :ok
  end
  
  def move_book_section
    book_section = @book.book_sections.find(params[:moved_id])
    book_section.insert_at(params[:position].to_i)
    head :ok
  end

  def show
    gon.recipes_by_section = @book.book_recipes.all.inject({}) {|acc, record| acc[record.book_section_id || 0] = (acc[record.book_section_id || 0]||[])+[to_obj(record)]; acc}
    gon.book_sections = to_obj(@book.book_sections.order(:position).to_a)
    #gon.book_recipes = to_obj(@book.book_recipes.order(:position).to_a)
  end

  def search_data
    respond_to do |format|
      format.json {
        data = {}
        data[:recipes_by_section] = @book.book_recipes.all.inject({}) {|acc, record| acc[record.book_section_id || 0] = (acc[record.book_section_id || 0]||[])+[to_obj(record)]; acc}
        data[:book_sections] = to_obj(@book.book_sections.order(:position).to_a)
        render json: data
      }
    end
  end
  
  def edit
    gon.book = to_obj(@book)
    gon.book_sections = to_obj(@book.book_sections.order(:position).to_a)
    gon.book_recipes = to_obj(@book.book_recipes.order(:position).to_a)
    gon.move_book_recipe_url = move_book_recipe_book_path(@book)
    gon.move_book_section_url = move_book_section_book_path(@book)
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
    respond_to do |format|
      format.json {render json: to_obj(@book)}
      format.html {redirect_to @book}
    end
  end

  def destroy
    @book.destroy
    redirect_to books_path
  end

  private
    def set_book
      @book = current_user.books.find(params[:slug].split('-')[0])
    end
    def set_public_book
      @book = Book.includes([{book_recipes: :recipe}, :book_sections]).find(params[:slug].split('-')[0])
      raise "Not allowed" unless @book.is_public || @book.user_id == current_user_id
      #base = Book.includes([{book_recipes: :recipe}, :book_sections])
      #query = base.where(is_public: true).or(base.where(user_id: current_user_id))
      #@book = query.find(params[:slug].split('-')[0])
    end

    def book_params
      params.require(:book).permit(:name, :theme_id, :is_public, :json, :html, :book_format_id, :front_page_image_id, :front_page_text_color, :hide_front_page_text, :background_color, :description_json, :description_html)
    end
end
