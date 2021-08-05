class ContainersController < ApplicationController
  before_action :set_container, only: [:update, :destroy]
  #skip_before_action :only_admin!

  def create
    @container = Container.new(container_params)

    @container.save!
    redirect_back fallback_location: @container.machine
  end

  def update
    @container.update!(container_params)
    redirect_back fallback_location: @container.machine
  end

  def destroy
    @container.destroy!
    redirect_back fallback_location: @container.machine
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
      params.require(:container).permit(:container_format_id, :jar_id, :machine_id)
    end
end
