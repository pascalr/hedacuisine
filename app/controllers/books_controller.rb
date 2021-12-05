class BooksController < ApplicationController
  before_action :set_book, only: %i[ edit update destroy ]
  skip_before_action :authenticate_user!, only: [:show]
  skip_before_action :only_admin!, only: [:show]

  def show
    @book = Book.find(params[:id])
  end
  
  def edit
  end

  def new
    @book = Book.new
  end

  def index
    @books = Book.all.order(:name)
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
      @book = current_user.books.find(params[:id])
    end

    def book_params
      params.require(:book).permit(:name)
    end
end
