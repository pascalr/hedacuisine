class BookSectionsController < ApplicationController
  before_action :set_book
  before_action :set_book_section, only: [:update, :destroy]
  skip_before_action :only_admin!

  def create
    book_section = @book.book_sections.create!(book_section_params)
    respond_to do |format|
      format.html {redirect_back fallback_location: books_path}
      format.js {render json: {book_section: {class_name: "book_section", id: book_section.id, name: book_section.name, url: book_book_section_path(@book, book_section)}}}
    end
  end

  def update
    @book_section.update!(book_section_params)
    redirect_back fallback_location: books_path
  end

  def destroy
    @book_section.destroy!
    redirect_back fallback_location: books_path
  end

  private
    
    def set_book
      @book = current_user.books.find(params[:book_slug].split('-')[0])
    end

    def set_book_section
      @book_section = @book.book_sections.find(params[:id])
    end

    def book_section_params
      params.require(:book_section).permit(:name)
    end
end
