class HomeController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :beta]
  skip_before_action :only_admin!
  def index
    @kinds = Kind.all
    @kinds_by_categories = @kinds.map {|k| [k, k.recipe_kinds.limit(10)] }.sort_by {|(k, rs)| rs.size }.reverse
  end
  def beta
  end
  def ecological
  end
end
