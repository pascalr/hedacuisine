class RecipesController < ApplicationController
  before_action :set_recipe, only: [:do_process, :show, :edit, :update, :destroy, :rate]

  # GET /recipes
  # GET /recipes.json
  def index
    #@tags = Tag.order(priority: :desc).where("priority >= 400")
    #@tags = Tag.order(priority: :desc)
    @recipes = Recipe.order(:name).all
    @items = Item.order(:name).all
  end

  # GET /recipes/1
  # GET /recipes/1.json
  def show
    raise "Not implemented..."
  end

  # Somehow process is an invalid method name in a Rails controller.
  def do_process
    require Rails.root().join("lib").join("recipe_preprocessor.rb")
    RecipeProcessor.new.process(@recipe)
    redirect_to recipe_path(@recipe)
  end

  #def do_process
  #  #out, err, status = parse_recipe(@recipe.id)
  #  #logger.info "stdout is:" + out.to_s
  #  #logger.info "stderr is:" + err.to_s
  #  #logger.info "status is:" + status.to_s
  #  #status
  #  #if status.success?
  #  #  #redirect_to recipe_path(@recipe), notice: "Successfully processed the recipe!"
  #  #  render :show, notice: "Successfully processed the recipe!"
  #  #else
  #  #  @recipe.errors.add(:base, err.to_s)
  #  #  #redirect_to recipe_path(@recipe)
  #  #  render :show
  #  #end
  #  ##heda_run!("process #{@recipe.id}")
  #  errors = @recipe.do_process
  #  if errors
  #    @recipe.errors.add(:base, errors.to_s)
  #    render :show
  #  else
  #    redirect_to recipe_path(@recipe)
  #  end
  #end

  # GET /recipes/new
  def new
    @recipe = Recipe.new
  end

  # GET /recipes/1/edit
  def edit
  end

  # POST /recipes
  # POST /recipes.json
  def create
    @recipe = Recipe.new(recipe_params)

    respond_to do |format|
      if @recipe.save
        if params[:category_id]
          @category = Category.find(params[:category_id])
          MenuItem.new(category: @category, recipe: @recipe).save!
          format.html {redirect_to edit_menu_path(@category.menu), notice: 'Recipe was successfully created.'}
          format.json { render :show, status: :created, location: @recipe }
        else
          format.html {redirect_to edit_recipe_path(@recipe), notice: 'Recipe was successfully created.'}
          format.json { render :show, status: :created, location: @recipe }
        end
      else
        format.html { render :new }
        format.json { render json: @recipe.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /recipes/1
  # PATCH/PUT /recipes/1.json
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

  # DELETE /recipes/1
  # DELETE /recipes/1.json
  def destroy
    @recipe.destroy
    respond_to do |format|
      format.html { redirect_to recipes_url, notice: 'Recipe was successfully destroyed.' }
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
        @recipe = Recipe.find(params[:slug].split('-')[0])
      else
        @recipe = Recipe.find(params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def recipe_params
      p = params.require(:recipe).permit(:name, :instructions, :rating, :picture, :source, :primary_image_id, :secondary_image_left_id, :secondary_image_middle_id, :secondary_image_right_id, :comment, :source_image, :item_id, :image_id, tag_ids: [])
      p[:image_id] == "on" ? p.except(:image_id) : p
    end
end
