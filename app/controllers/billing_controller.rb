class BillingController < ApplicationController
  def index
    @stats = ActiveStorage.service
  end
end
