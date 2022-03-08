require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

# FIXME: Hack for allowing SVG files. While this hack is here, we should **not**
# allow arbitrary SVG uploads. https://github.com/rails/rails/issues/34665
ActiveStorage::Engine.config
.active_storage
.content_types_to_serve_as_binary
.delete('image/svg+xml')

LOCALE_TO_CODE = {
  'fr-CA': 'qc',
  'fr-FR': 'fr',
  'en-CA': 'ca',
  'en-US': 'us'
}

RouteTranslator.config do |config|
  config.force_locale = true
  config.available_locales = ['fr-CA', 'en-CA', 'fr-FR', 'en-US']
  #config.locale_param_key = :region
  config.locale_segment_proc = -> (locale) { LOCALE_TO_CODE[locale] }
end

module Hedacuisine
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    # Set the default locale to French canada
    #config.i18n.default_locale = 'fr-CA'
    config.i18n.default_locale = 'fr-CA'

    config.to_prepare do
      Devise::SessionsController.skip_before_action :only_admin!, raise: false
    end

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
  end
end
