class SitemapController < ApplicationController
  skip_before_action :authenticate_account!
  skip_before_action :only_admin!
  def index
    render layout: false
  end
end
