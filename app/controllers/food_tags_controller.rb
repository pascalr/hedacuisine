class FoodTagsController < ApplicationController
  before_action :set_food_tag, only: %i[ show edit update destroy ]

  # GET /food_tags or /food_tags.json
  def index
    @food_tags = FoodTag.all
  end

  # GET /food_tags/1 or /food_tags/1.json
  def show
  end

  # GET /food_tags/new
  def new
    @food_tag = FoodTag.new
  end

  # GET /food_tags/1/edit
  def edit
  end

  # POST /food_tags or /food_tags.json
  def create
    @food_tag = FoodTag.new(food_tag_params)

    respond_to do |format|
      if @food_tag.save
        format.html { redirect_to @food_tag, notice: "Food tag was successfully created." }
        format.json { render :show, status: :created, location: @food_tag }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @food_tag.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /food_tags/1 or /food_tags/1.json
  def update
    respond_to do |format|
      if @food_tag.update(food_tag_params)
        format.html { redirect_to @food_tag, notice: "Food tag was successfully updated." }
        format.json { render :show, status: :ok, location: @food_tag }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @food_tag.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /food_tags/1 or /food_tags/1.json
  def destroy
    @food_tag.destroy
    respond_to do |format|
      format.html { redirect_to food_tags_url, notice: "Food tag was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_food_tag
      @food_tag = FoodTag.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def food_tag_params
      params.require(:food_tag).permit(:name)
    end
end
