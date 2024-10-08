class HomeController < ApplicationController
  skip_before_action :authenticate_account!, only: [:index]
  skip_before_action :only_admin!
  def index
    @books = Book.all_featured.limit(5)
    if Rails.env == "production" && current_user
      redirect_to app_path 
    else
      @kinds = Kind.all
      @kinds_by_categories = @kinds.map {|k| [k, k.recipe_kinds.limit(10)] }.sort_by {|(k, rs)| rs.size }.reverse
    end
  end
  def ecological
  end
end
