class DescriptionsController < ApplicationController

  before_action :validate_allowed

  def validate_allowed
  end

  def create
    @description = Description.new(description_params)

    respond_to do |format|
      if @description.save
        format.html { redirect_to edit_menu_path(@description.menu), notice: 'Category was successfully created.' }
        format.json { render :show, status: :created, location: @description }
      else
        format.html { render :new }
        format.json { render json: @description.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @description.update(category_params)
        format.html { redirect_to edit_menu_path(@description.menu), notice: 'Category was successfully updated.' }
        format.json { render :show, status: :ok, location: @description }
      else
        format.html { render :edit }
        format.json { render json: @description.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @description.destroy
    respond_to do |format|
      format.html { redirect_to categories_url, notice: 'Category was successfully destroyed.' }
      format.json { head :no_content }
    end
  end
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_description
      @description = Description.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def description_params
      params.require(:description).permit(:content, :language_id, :described_id, :described_type)
    end
end
