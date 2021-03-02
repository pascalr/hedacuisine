class LinksController < ApplicationController
  before_action :set_recipe, only: [:do_process, :show, :edit, :update, :destroy, :rate]
  skip_before_action :authenticate_user!, only: [:show]

  def index
    #@tags = Tag.order(priority: :desc).where("priority >= 400")
    #@tags = Tag.order(priority: :desc)
    @recipes = Link.order(:name).all
    @items = Item.order(:name).all
  end

  def show
  end

  def new
    @recipe = Link.new
  end

  def edit
  end

  def update
    respond_to do |format|
      if @recipe.update(recipe_params)
        format.html { redirect_to link_path(@recipe), notice: 'Recipe was successfully updated.' }
        format.json { render :show, status: :ok, location: @recipe }
      else
        format.html { render :edit }
        format.json { render json: @recipe.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @recipe.destroy
    respond_to do |format|
      format.html { redirect_to links_url, notice: 'Recipe was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

    def parse_recipe(id)
      #system("#{Rails.root}/../invention/bin/parse_recipe #{id}")
      require 'open3'
      cmd = "#{Rails.root}/../invention/bin/recipe_parser #{Rails.root}/db/development.sqlite3 #{id}"
      Open3.capture3(cmd)
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_recipe
      if params[:slug]
        @recipe = Link.find(params[:slug].split('-')[0])
      else
        @recipe = Link.find(params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def recipe_params
      p = params.require(:link).permit(:name, :source)
      p[:image_id] == "on" ? p.except(:image_id) : p
    end
end
