class ContainersController < ApplicationController
  before_action :set_machine
  before_action :set_container, only: [:update, :destroy]
  #skip_before_action :only_admin!
  
  def index
  end
  
  def create
    jar_id = params[:jar_id].nil? ? Container.maximum(:jar_id).next : params[:jar_id]
    @machine.containers.create!(container_params.merge(jar_id: jar_id))
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
    
    def set_machine
      @machine = current_user.machines.find(params[:machine_id])
    end

    def set_container
      @container = @machine.containers.find(params[:id])
    end

    def container_params
      params.require(:container).permit(:container_format_id, :jar_id, :food_id)
    end
end
