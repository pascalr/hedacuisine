class RecipesController < ApplicationController
  before_action :set_recipe, only: [:do_process, :edit, :update, :destroy, :rate, :cheat, :validate, :view_body, :move_ing, :old_edit, :page]
  skip_before_action :authenticate_user!, only: [:show, :index]
  skip_before_action :only_admin!, only: [:show, :index]

  def index
    respond_to do |format|
      format.html {@recipes = Recipe.all_main.all_public.with_images.order(:created_at)}
      format.json {@recipes = Recipe.all_main.all_for(current_user).includes(:image).order(:name)}
    end
    #@recipes = Recipe.where(is_public: true).order(:created_at)
    #@recipes = Recipe.where(is_public: true, base_recipe_id: nil).where.not(image_id: nil)
    #@tags = Tag.order(priority: :desc).where("priority >= 400")
    #@tags = Tag.order(priority: :desc)
    #@recipes = Recipe.order(:name).all
    #@items = Item.order(:name).all
  end

  def my_recipes
    # OPTIMIZE: Using paginage for this is too much for nothing I believe
    @recipes = current_user.recipes.paginate(page: params[:page], per_page: 1)
    @recipe = @recipes.first
  end

  def move_ing
    ing = @recipe.ingredients.find(params[:ing_id])
    ing.insert_at(params[:position].to_i)
    head :ok
  end

  def validate
    @warnings = @recipe.warnings
  end

  def visibility
    @recipes = Recipe.where.not(image_id: nil)
  end

  def cheat
    instructions = ""
    @recipe.instructions.each_line do |l|
      next if l.strip.length == 0
      line = ""
      line += "ajouter " unless l.starts_with? "ajouter"
      line += l
      instructions += line.squeeze(' ')
    end
    @recipe.update! instructions: instructions
    redirect_to recipe_path(@recipe)
  end

  def show
    @recipe = Recipe.includes(recipe_ingredients: {food: [:direct_substitutions, :indirect_substitutions]}).find(params[:slug].split('-')[0])
    gon.jbuilder
    # FIXME: This allows any user to read any recipe. Ensure permission
    # if I allow private recipes.
    #redirect_to group_path(id: @recipe.group.id, recipe_id: @recipe.id) if @recipe.group
  end

  def new_variant
    @recipe = Recipe.new
    @recipe.base_recipe = Recipe.find(params[:base_recipe_id])
  end

  def new
    # FIXME: This allows any user to read any recipe. Ensure permission
    # if I allow private recipes.
    @recipe = Recipe.new
    #@recipe = params[:clone_id] ? Recipe.find(params[:clone_id]).dup : Recipe.new
    #@recipe.version_name = nil
  end

  def page
    render partial: "recipes/recipe_body", locals: {recipe: @recipe}
  end

  def edit
    gon.jbuilder
  end

  def create
    @recipe = Recipe.new(recipe_params)
    @recipe.user = current_user
    if @recipe.base_recipe
      @recipe.complete_instructions = @recipe.base_recipe.complete_instructions if @recipe.complete_instructions.blank?
      @recipe.preparation_time = @recipe.base_recipe.preparation_time
      @recipe.cooking_time = @recipe.base_recipe.cooking_time
      @recipe.servings_quantity = @recipe.base_recipe.servings_quantity
      @recipe.servings_name = @recipe.base_recipe.servings_name
      @recipe.total_time = @recipe.base_recipe.total_time
    end

    @recipe.transaction do
      @recipe.save!
      if @recipe.base_recipe
        @recipe.base_recipe.ingredients.order(:item_nb).each do |_ing|
          ing = _ing.dup
          ing.recipe = @recipe
          ing.save!
        end
      end
    end
    redirect_to @recipe
  end
  
  # Somehow process is an invalid method name in a Rails controller.
  def do_process
    load Rails.root().join("lib").join("recipe_preprocessor.rb")
    begin
      RecipeProcessor.new.process(@recipe)
      redirect_to recipe_path(@recipe)
    rescue MissingFoodError => e # FIXME: Temporary
      redirect_to new_food_path, alert: "Missing food #{e.food}"
    rescue => e
      raise if Rails.env.development?
      puts "#{e.message} !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!".red
      redirect_to recipe_path(@recipe), alert: e.message
    end
  end

  def update
    respond_to do |format|
      if @recipe.update(recipe_params)
        format.html { redirect_back fallback_location: edit_recipe_path(@recipe), notice: 'Recipe was successfully updated.' }
        format.json { render :show, status: :ok, location: @recipe }
        format.js { head :ok }
      else
        format.html { render :edit }
        format.json { render json: @recipe.errors, status: :unprocessable_entity }
        format.js { render json: @recipe.errors, status: :unprocessable_entity }
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
      params.require(:recipe).permit(:name, :source, :instructions, :version_name, :group_id, :complete_instructions, :image_id, :raw_servings, :preparation_time, :cooking_time, :total_time, :is_public, :base_recipe_id, :description, :main_ingredient_id, :kind_id, :version_nb, :content, :text, :recipe_kind_id, :json, :html) # FIXME: html (NOT SAFE)
      # FIXME: Remove version_nb from this list when it works properly. When don't want users to change that...
      #p[:image_id] == "on" ? p.except(:image_id) : p
    end
end
