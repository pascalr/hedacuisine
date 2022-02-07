class MachineUsersController < ApplicationController
  before_action :set_machine_user, only: [:update, :destroy]
  skip_before_action :only_admin!

  def new
    @machine_user = MachineUser.new
  end

  def create
    @machine_user = current_user.machine_users.build(machine_user_params)
    @machine_user.save!
    redirect_back fallback_location: machines_path
  end

  def update
    @machine_user.update!(machine_user_params)
    redirect_back fallback_location: machines_path
  end

  def destroy
    @machine_user.destroy!
    redirect_back fallback_location: machines_path
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_machine_user
      @machine_user = current_user.machine_users.find(params[:id])
      raise "Invalid user exception" unless @machine_user.menu.user_id == current_user_id
    end

    # Only allow a list of trusted parameters through.
    def machine_user_params
      # FIXME: Ensure machine belongs to current user...
      params.require(:machine_user).permit(:user_id, :machine_id, :nickname)
    end
end
