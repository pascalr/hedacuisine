class ApplicationController < ActionController::Base
  before_action :authenticate_account!
  before_action :set_region_and_locale
  before_action :only_admin!

  include ApplicationHelper
  include SerializeHelper 

  # An ugly hack because I don't know how to access external methods form jbuilder.
  before_action :set_application_controller
  def set_application_controller
    @application_controller = self
  end
  
  def paginate_collections(collections, offset, nbItems)
    result = []
    collections.each do |collection|
      result += collection.offset(offset).limit(nbItems - result.size)
      break if result.size >= nbItems
    end
    return result
  end

  def set_region_and_locale
    #@region = current_region
    #I18n.locale = @region.locale
    #if params[:locale].blank? and !params[:region].blank?
    #  I18n.locale = current_region.locale
    #else
      I18n.locale = params[:locale] || I18n.default_locale
    #end
  end

  def only_admin!
    if current_account && !current_account.admin?
      # FIXME: This can do an infinite redirect, if the referrer an only be seen by an admin...
      #redirect_to request.referrer, alert: 'Only administrators can see this page!'
      raise "Only administrators can see this page!"
    end
  end

  def after_sign_in_path_for(resource)
    app_path
    #my_recipes_path
  end

  def after_sign_out_path_for(resource_or_scope)
    "https://www.hedacuisine.com/"
    #request.referrer
  end

  def default_url_options
    { locale: I18n.locale }
  end
end
