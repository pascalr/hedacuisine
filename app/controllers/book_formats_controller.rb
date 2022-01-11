class BookFormatsController < ApplicationController
  before_action :set_book_format, only: [:show, :update, :destroy]

  def index
    @foods = Food.all
    @book_formats = BookFormat.all
  end

  def create
    book_format = BookFormat.create!(book_format_params)
    redirect_back fallback_location: book_format_path(book_format)
  end

  def update
    @book_format.update!(book_format_params)
    redirect_back fallback_location: book_format_path(@book_format)
  end

  def destroy
    @book_format.destroy!
    redirect_back fallback_location: book_formats_path
  end

private
  
  def set_book_format
    @book_format = BookFormat.find(params[:id])
  end
    
  def book_format_params
    params.require(:book_format).permit(:name, :page_width_mm, :page_height_mm)
  end
end
