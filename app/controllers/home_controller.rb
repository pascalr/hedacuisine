class HomeController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :beta]
  skip_before_action :only_admin!
  def index
    @kinds = Kind.all
  end
  def beta
  end
  def ecological
  end
end
