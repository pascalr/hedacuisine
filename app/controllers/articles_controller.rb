class ArticlesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]
  skip_before_action :only_admin!, only: [:index, :show]
  before_action :set_article, only: [:show, :update, :destroy, :edit]

  def index
    @articles = Article.all_public
  end

  def show
  end

  def edit
    gon.jbuilder
  end

  def new
    @article = Article.new
  end

  def create
    article = Article.create!(article_params)
    redirect_to edit_article_path(article)
  end

  def update
    @article.update!(article_params)
    redirect_back fallback_location: article_path(@article)
  end

  def destroy
    @article.destroy!
    redirect_back fallback_location: articles_path
  end

private
  
  def set_article
    @article = Article.find(params[:slug].split('-')[0])
  end
    
  def article_params
    params.require(:article).permit(:name, :intro, :is_public, :content, :json, :html)
  end
end
