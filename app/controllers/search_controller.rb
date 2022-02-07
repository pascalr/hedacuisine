class SearchController < ApplicationController
  skip_before_action :authenticate_user!
  skip_before_action :only_admin!
  def index
    @foods= Food.where("lower(name) like ? OR lower(plural) like ?", "%#{params[:search]}%", "%#{params[:search]}%")
    @recipes = Recipe.where("lower(name) like ?", "%#{params[:search]}%")
    @results = @recipes + @foods
  end
  def data
    respond_to do |format|
      format.json {
        @items = []
        recipe_kinds = RecipeKind.includes(:image).order(:name)
        books = Book.all_public.includes(:front_page_image).order(:name)
        if current_user
          @items += books.select {|b| b.user_id == current_user_id}
          recipes = current_user.recipes.includes(:recipe_image).order(:name)
          @items += recipes
          kinds = recipes.map(&:recipe_kind_id)
          recipe_kinds = recipe_kinds.reject {|r| kinds.include?(r.id) }
          @items += recipe_kinds
          @items += books.reject {|b| b.user_id == current_user_id}
        else
          @items += recipe_kinds
          @items += books
        end
      }
    end
  end
end
