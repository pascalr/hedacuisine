class SitemapController < ApplicationController
  skip_before_action :authenticate_user!
  skip_before_action :only_admin!
  def index
    render layout: false
  end
end
