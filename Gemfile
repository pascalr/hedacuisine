source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.0.2'

# -------- MINE --------------
gem 'figaro' # For environment variables # Deprecated. Use `heroku config` instead
gem 'activestorage-backblaze' # For storing images on backblaze
gem 'react-rails' # For using react
gem 'gon' # For passing data from rails to js
gem 'will_paginate', '~> 3.1.0' # Unused I believe...
gem 'route_translator' # To translate routes based on locale
gem 'ruby-prof' # For profiling
gem 'devise' # For authentication
gem 'devise-i18n' # For authentication in all languages
#gem 'serialport' # For communicating with arduino (serial)
#gem 'filequeue' # For the simulation
#gem 'mittsu' # For simulation and collision detection
#gem 'nokogiri', '1.10.10'
gem "simple_calendar", "~> 2.0" # For a calendar
gem 'rails-i18n', '>= 6.0.0' # For locale (languages by region)
gem 'mini_magick' # to analyze image widths
gem 'piet' # to reduce file size
gem "aws-sdk-s3", require: false # For AWS
gem "acts_as_list", "~> 1.0"
gem 'chartkick'
#gem 'importmap-rails' # For javascript, not using yet because import maps are not supported by my old smartphone
gem 'jsbundling-rails' # For javascript
gem 'cssbundling-rails' # For automatically detecting changes to css.
gem "sprockets-rails" # I don't know...
gem 'foreman' # In order to use bin/dev
# ----------------------------

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
#gem 'rails', '~> 6.0.3', '>= 6.0.3.4'
gem 'rails', '~> 7.0.2'
# Use postgresql as the database for Active Record
gem 'pg', '>= 0.18', '< 2.0'
# Use Puma as the app server
gem 'puma', '~> 4.1'
# Use SCSS for stylesheets
gem 'sass-rails', '>= 6'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.7'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Active Storage variant
gem 'image_processing'#, '~> 1.2'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.2', require: false

group :development, :test, :local do
  gem 'sqlite3'
end

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '~> 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '>= 2.15'
  gem 'selenium-webdriver'
  # Easy installation and use of web drivers to run system tests with browsers
  gem 'webdrivers'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
