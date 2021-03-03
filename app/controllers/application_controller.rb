class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :set_locale
  before_action :only_admin!

  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
  end

  def only_admin!
    unless current_user.admin?
      redirect_to request.referrer, alert: 'Only administrators can see this page!'
    end
  end

  def default_url_options
    { locale: I18n.locale }
  end
end
