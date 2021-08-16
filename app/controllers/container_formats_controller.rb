class ContainerFormatsController < ApplicationController
  before_action :set_container_format, only: %i[ show edit update destroy ]

  # GET /container_formats or /container_formats.json
  def index
    @container_formats = ContainerFormat.all
  end

  # GET /container_formats/1 or /container_formats/1.json
  def show
  end

  # GET /container_formats/new
  def new
    @container_format = ContainerFormat.new
  end

  # GET /container_formats/1/edit
  def edit
  end

  # POST /container_formats or /container_formats.json
  def create
    @container_format = ContainerFormat.new(container_format_params)

    respond_to do |format|
      if @container_format.save
        format.html { redirect_to @container_format, notice: "Container format was successfully created." }
        format.json { render :show, status: :created, location: @container_format }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @container_format.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /container_formats/1 or /container_formats/1.json
  def update
    respond_to do |format|
      if @container_format.update(container_format_params)
        format.html { redirect_to @container_format, notice: "Container format was successfully updated." }
        format.json { render :show, status: :ok, location: @container_format }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @container_format.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /container_formats/1 or /container_formats/1.json
  def destroy
    @container_format.destroy
    respond_to do |format|
      format.html { redirect_to container_formats_url, notice: "Container format was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_container_format
      @container_format = ContainerFormat.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def container_format_params
      params.require(:container_format).permit(:name, :diameter, :height_with_lid, :lid_height, :max_content_height, :body_weight, :lid_weight, :volume, :icon)
    end
end
