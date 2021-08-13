class ContainersController < ApplicationController
  before_action :set_container, only: [:update, :destroy]
  #skip_before_action :only_admin!
  
  def create
    @container = Container.new(container_params)
    @container.jar_id = Container.maximum(:jar_id).next if @container.jar_id.nil?

    @container.save!
    #redirect_to machines_path({active_tab: params[:active_tab], last_container_format_id: @container.container_format_id})
    redirect_back fallback_location: machines_path
  end

  def update
    @container.update!(container_params)
    redirect_back fallback_location: machines_path
  end

  def destroy
    @container.destroy!
    redirect_back fallback_location: machines_path
  end

  def show
    @container = Container.find(params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_container
      @container = Container.find(params[:id])
      # FIXME: Security ensure current user is allowed
      #raise "Invalid user exception" unless @container.menu.user_id == current_user.id
    end

    # Only allow a list of trusted parameters through.
    def container_params
      # FIXME: Ensure machine belongs to current user...
      params.require(:container).permit(:container_format_id, :jar_id, :machine_id)
    end
end
