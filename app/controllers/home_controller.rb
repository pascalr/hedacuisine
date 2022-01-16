class HomeController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]
  skip_before_action :only_admin!
  def index
    #@books = Book.all_featured.limit(5)
    @books = Book.all.limit(5)
    if Rails.env == "production" && current_user
      redirect_to my_recipes_recipes_path
    else
      @kinds = Kind.all
      @kinds_by_categories = @kinds.map {|k| [k, k.recipe_kinds.limit(10)] }.sort_by {|(k, rs)| rs.size }.reverse
    end
  end
  def ecological
  end
end
