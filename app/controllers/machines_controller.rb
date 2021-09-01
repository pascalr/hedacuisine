class MachinesController < ApplicationController
  before_action :set_machine, only: %i[ show edit update destroy inventory grocery_list config inventory_config grocery_config ]
  skip_before_action :authenticate_user!, only: [:index]
  skip_before_action :only_admin!, only: [:index, :inventory, :inventory_config, :grocery_config, :show]

  # GET /machines or /machines.json
  def index
    if current_user and current_user.machines.first
      @machine = current_user.machines.first
      redirect_to inventory_machine_path(@machine)
    end
  end

  def inventory_config
  end

  def grocery_config
  end

  # GET /machines/1 or /machines/1.json
  def show
  end

  # GET /machines/new
  def new
    @machine = Machine.new
  end

  # GET /machines/1/edit
  def edit
  end

  # POST /machines or /machines.json
  def create
    @machine = Machine.new(machine_params)

    respond_to do |format|
      if @machine.save
        format.html { redirect_to @machine, notice: "Machine was successfully created." }
        format.json { render :show, status: :created, location: @machine }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @machine.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /machines/1 or /machines/1.json
  def update
    respond_to do |format|
      if @machine.update(machine_params)
        format.html { redirect_to @machine, notice: "Machine was successfully updated." }
        format.json { render :show, status: :ok, location: @machine }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @machine.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /machines/1 or /machines/1.json
  def destroy
    @machine.destroy
    respond_to do |format|
      format.html { redirect_to machines_url, notice: "Machine was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_machine
      @machine = current_user.machines.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def machine_params
      params.require(:machine).permit(:name)
    end
end
