class CategoriesController < ApplicationController
  before_action :set_category, only: [:update, :destroy]
  skip_before_action :only_admin!

  def create
    @category = Category.new(category_params)

    respond_to do |format|
      if @category.save
        format.html { redirect_to edit_menu_path(@category.menu), notice: 'Category was successfully created.' }
        format.json { render :show, status: :created, location: @category }
      else
        format.html { render :new }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @category.update(category_params)
        format.html { redirect_to edit_menu_path(@category.menu), notice: 'Category was successfully updated.' }
        format.json { render :show, status: :ok, location: @category }
      else
        format.html { render :edit }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @category.destroy
    respond_to do |format|
      format.html { redirect_to edit_menu_path(@category.menu), notice: 'Category was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_category
      @category = Category.find(params[:id])
      raise "Invalid user exception" unless @category.menu.user_id == current_user_id
    end

    # Only allow a list of trusted parameters through.
    def category_params
      params.require(:category).permit(:name, :menu_id)
    end
end
