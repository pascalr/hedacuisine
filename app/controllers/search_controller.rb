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
        @items = RecipeKind.includes(:image).order(:name).map {|r| {label: r.name, url: recipe_kind_path(r), image: thumb_image_path(r.image)} }
        @items += Book.all_public.includes(:front_page_image).order(:name).map {|r| {label: r.name, url: book_path(r), image: portrait_thumb_image_path(r.front_page_image)} }
  #<% links = RecipeKind.all.order(:name).map {|r| {label: r.name, url: recipe_kind_path(r)} } %>
  #<% if current_user %>
  #  <% links += current_user.recipes.order(:name).map {|r| {label: r.name, url: recipe_path(r)} } %>
  #<% end %>
        #@recipes = Recipe.all_main.all_for(current_user).includes(:image).order(:name)
      }
    end
  end
end
