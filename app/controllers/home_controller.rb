class HomeController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :beta]
  skip_before_action :only_admin!
  def index
    @kinds = Kind.all
    @recipes_by_kind = @kinds.map {|k| [k, k.recipes.all_main.all_public.with_images.limit(10)] }.sort_by {|(k, rs)| rs.size }.reverse
  end
  def beta
  end
  def ecological
  end
end
