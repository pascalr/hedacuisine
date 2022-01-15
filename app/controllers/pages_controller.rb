class PagesController < ApplicationController
  before_action :set_book
  before_action :set_page, only: [:update, :destroy]
  skip_before_action :only_admin!

  def create
    page = @book.pages.build(page_params)
    page.page_nb = @book.pages.size
    page.save!
    respond_to do |format|
      format.html {redirect_back fallback_location: books_path}
      format.js {render json: page}
    end
  end

  def update
    @page.update!(page_params)
    redirect_back fallback_location: books_path
  end

  def destroy
    @page.destroy!
    redirect_back fallback_location: books_path
  end

  private
    
    def set_book
      @book = current_user.books.find(params[:book_slug].split('-')[0])
    end

    def set_page
      @page = @book.pages.find(params[:id])
    end

    def page_params
      params.require(:page).permit(:empty)
    end
end
