class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :set_region_and_locale
  before_action :only_admin!

  include ApplicationHelper

  def set_region_and_locale
    @region = current_region
    I18n.locale = @region.locale
  end

  def only_admin!
    if current_user && !current_user.admin?
      redirect_to request.referrer, alert: 'Only administrators can see this page!'
    end
  end

  def after_sign_in_path_for(resource)
    user_recipes_path
  end

  def default_url_options
    { region: @region.code }
  end
end
