class ArticlesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]
  skip_before_action :only_admin!, only: [:index]
end
