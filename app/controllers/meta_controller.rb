class MetaController < ApplicationController
  def index
    redirect_to stats_index_path
  end
end
