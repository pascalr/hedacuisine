class HomeController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]
  skip_before_action :only_admin!
  def index
  end
  def ecological
  end
end
