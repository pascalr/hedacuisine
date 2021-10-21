class KindsController < ApplicationController
  before_action :set_kind, only: %i[ show edit update destroy ]
  skip_before_action :authenticate_user!, only: [:show]
  skip_before_action :only_admin!, only: [:show]

  def show
  end
  
  def edit
  end

  def index
    @kinds = Kind.all.order(:name)
  end

  def create
    @kind = Kind.new(kind_params)
    @kind.save!
    redirect_to kinds_path
  end

  def update
    @kind.update!(kind_params)
    redirect_to kinds_path
  end

  def destroy
    @kind.destroy
    redirect_to kinds_path
  end

  private
    def set_kind
      @kind = Kind.find(params[:id])
      #@kind = Kind.find(params[:slug].split('-')[0])
    end

    def kind_params
      params.require(:kind).permit(:name, :image_id, :description)
    end
end
