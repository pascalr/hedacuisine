class RecipesController < ApplicationController
  before_action :set_recipe, only: [:do_process, :edit, :update, :destroy, :rate]
  skip_before_action :authenticate_user!, only: [:show]
  skip_before_action :only_admin!

  def index
    #@tags = Tag.order(priority: :desc).where("priority >= 400")
    #@tags = Tag.order(priority: :desc)
    @recipes = Recipe.order(:name).all
    @items = Item.order(:name).all
  end

  def show
    @recipe = Recipe.find(params[:slug].split('-')[0])
  end

  def new
    @recipe = Recipe.new
  end

  def edit
  end
  
  # Somehow process is an invalid method name in a Rails controller.
  def do_process
    load Rails.root().join("lib").join("recipe_preprocessor.rb")
    RecipeProcessor.new.process(@recipe)
    redirect_to recipe_path(@recipe)
  rescue => e
    raise if Rails.env.development?
    puts "#{e.message} !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!".red
    redirect_to recipe_path(@recipe), alert: e.message
  end

  def update
    respond_to do |format|
      if @recipe.update(recipe_params)
        format.html { redirect_to recipe_path(@recipe), notice: 'Recipe was successfully updated.' }
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
      format.html { redirect_to recipes_url, notice: 'Recipe was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

    # Use callbacks to share common setup or constraints between actions.
    def set_recipe
      @recipe = current_user.recipes.find(params[:slug].split('-')[0])
    end

    # Only allow a list of trusted parameters through.
    def recipe_params
      p = params.require(:recipe).permit(:name, :source, :instructions)
      #p[:image_id] == "on" ? p.except(:image_id) : p
    end
end
