class RecipesController < ApplicationController
  before_action :set_recipe, only: [:do_process, :edit, :update, :destroy, :rate, :cheat, :view_body, :move_ing, :old_edit, :page, :paste_ingredients]
  skip_before_action :authenticate_account!, only: [:show, :index]
  skip_before_action :only_admin!, only: [:show, :index]

  def index
    #@recipes = Recipe.all_main.all_public.with_images.order(:created_at)
    @kinds = Kind.all
    @kinds_by_categories = @kinds.map {|k| [k, k.recipe_kinds.limit(10)] }.sort_by {|(k, rs)| rs.size }.reverse
    #@recipes = Recipe.where(is_public: true).order(:created_at)
    #@recipes = Recipe.where(is_public: true, base_recipe_id: nil).where.not(image_id: nil)
    #@tags = Tag.order(priority: :desc).where("priority >= 400")
    #@tags = Tag.order(priority: :desc)
    #@recipes = Recipe.order(:name).all
    #@items = Item.order(:name).all
  end

  def update_tags
    @recipe = Recipe.find(params[:slug].split('-')[0])
    tag_ids = params[:tags] || []
    current_tag_ids = []
    current_suggestions = current_user.suggestions.where(recipe_id: @recipe.id)
    destroyed = []
    created = []
    ActiveRecord::Base.transaction do
      current_suggestions.each do |suggestion|
        i = tag_ids.index suggestion.filter_id
        if i.nil?
          destroyed << suggestion.id
          suggestion.destroy 
        end
        tag_ids.delete_at(i) unless i.nil?
      end
      tag_ids.each do |id|
        s = current_user.suggestions.create(recipe_id: @recipe.id, filter_id: id)
        created << s.to_obj_with_recipe_info
      end
    end
    render json: {created: created, destroyed: destroyed}
  end

  # TODO: Move all these functions elsewhere, inside lib? Inside RecipeIngredient?
  def __trim_between_unit_and_food(line)
    line = line.strip
    line = line[1..-1].lstrip if line.start_with? '.'
    line = line[2..-1].lstrip if line.start_with? 'de'
    line
    
  end
  def __extract_qty(line)
    started = false
    result = ''
    line.length.times do |i|
      c = line[i]
      # FIXME: Do a smarter parsing than that. I feel that I have implemented a parsing many times like that, but I don't know where. Inside Quantity?
      is_digit = (c <= '9' && c >= '0' || c == ',' || c == '.' || c == '/' || c == ' ')
      return result.strip, line[i..-1].strip if started && !is_digit
      started = true if is_digit
      result += c if started
    end
    return result.blank? ? [nil, line] : [result.strip, nil]
  end
  def __extract_unit(line)
    #units = current_region.units
    units = Unit.all
    strs = units.map(&:name)
    strs.sort_by(&:length).reverse.each do |unit_name|
      if line.start_with?(unit_name)
        return unit_name, line[unit_name.length..-1].strip
      end
    end
    return nil, line
  end
  # TODO: Move all these functions elsewhere, inside lib? Inside RecipeIngredient?
  def paste_ingredients
    ActiveRecord::Base.transaction do
      @recipe.recipe_ingredients.destroy_all
      text = params[:pasted]
      text.each_line do |raw_line|
        line = raw_line.strip
        if line.include? ";"
          s = line.split(";", 2)
          @recipe.recipe_ingredients.create!(raw: s[0].rstrip, raw_food: s[1].lstrip)
        else
          qty, rest = __extract_qty(line)
          unit, raw_food = __extract_unit(rest)
          trimmed_food = __trim_between_unit_and_food(raw_food)
          raw = qty.to_s + (qty.blank? || unit.blank? ? '' : ' ') + unit.to_s
          @recipe.recipe_ingredients.create!(raw: raw, raw_food: trimmed_food)
        end
      end
    end
    respond_to do |format|
      format.json { render json: {ingredients: (@recipe.recipe_ingredients.order(:item_nb).map {|r| to_obj(r)})} }
    end
  end

  def my_recipes
    #gon.recipes = current_user.recipes.order(:name).map {|r| r.to_obj(only: :name)} # Commented because showing percentage completed which requires all the data
    gon.recipes = current_user.recipes.order(:name).map {|r| r.to_obj}
  end

  def user_recipes
    render json: ({
      userRecipes: current_user.recipes.order(:name).map {|r| r.to_obj(only: :name)},
      favoriteRecipes: current_user.favorite_recipes.includes(:recipe).sort_by {|fav| fav.recipe.name}.map {|fav| o = fav.recipe.to_obj(only: :name); o[:fav_id] = fav.id; o}
    #render json: current_user.recipes.order(:name).map {|r| r.to_obj}
    })
  end

  def move_ing
    ing = @recipe.ingredients.find(params[:ing_id])
    ing.insert_at(params[:position].to_i)
    head :ok
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
    if current_user
      # Send books data in order to be able to add the recipe to the current user books.
      gon.books = current_user.books.map {|b| b.to_obj(only: :name)}
    end
    gon.recipe_id = @recipe.id
    gon.jbuilder
  end

  def inline
    @inline = true # FIXME: Using this for _edit_menu. This may cause issue because of caching partials?
    @recipe = Recipe.includes(recipe_ingredients: {food: [:direct_substitutions, :indirect_substitutions]}).find(params[:slug].split('-')[0])
    if current_user
      # Send books data in order to be able to add the recipe to the current user books.
      gon.books = current_user.books.map {|b| b.to_obj(only: :name)}
    end
    gon.recipe_id = @recipe.id
    gon.jbuilder
    render "recipes/inline", :layout => false
  end

  def new_variant
    @recipe = Recipe.new
    @recipe.base_recipe = current_user.recipes.find(params[:base_recipe_id])
  end

  def new
    # FIXME: This allows any user to read any recipe. Ensure permission
    # if I allow private recipes.
    @recipe = Recipe.new
    #@recipe = params[:clone_id] ? current_user.recipes.find(params[:clone_id]).dup : Recipe.new
    #@recipe.version_name = nil
  end

  def page
    render partial: "recipes/recipe_body", locals: {recipe: @recipe}
  end

  def edit
    gon.recipe = to_obj(@recipe)
    gon.recipe_image = to_obj(@recipe.recipe_image) if @recipe.recipe_image
    gon.recipe_kind_image = to_obj(@recipe.recipe_kind.image) if @recipe.recipe_kind && @recipe.recipe_kind.image
    gon.jbuilder
  end

  def duplicate
    # FIXME: WARNING: This allows any user to duplicate any recipe even private ones
    cloned = Recipe.find(params[:slug].split('-')[0])
    @recipe = cloned.dup
    @recipe.user = current_user
    ActiveRecord::Base.transaction do
      @recipe.save!
      # TODO: Duplicate everything... tools... comments... notes...
      cloned.recipe_ingredients.each do |ing|
        ingredient = ing.dup
        ingredient.recipe = @recipe
        ingredient.save!
      end
    end
    redirect_to edit_recipe_path(@recipe)
  end

  def create
    @recipe = Recipe.new(recipe_params)
    @recipe.recipe_kind = @recipe.match_category
    @recipe.user = current_user
    if @recipe.base_recipe # deprecated, use duplicate
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
    redirect_to edit_recipe_path(@recipe)
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
        format.json { render json: {recipe: to_obj(@recipe), recipe_image: to_obj(@recipe.recipe_image)} }
        format.js { render partial: @recipe }
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
      params.require(:recipe).permit(:name, :source, :instructions, :version_name, :group_id, :complete_instructions, :image_id, :raw_servings, :preparation_time, :cooking_time, :total_time, :is_public, :base_recipe_id, :description, :main_ingredient_id, :kind_id, :version_nb, :content, :text, :json, :html, :use_personalised_image) # FIXME: html (NOT SAFE)
      # FIXME: Remove version_nb from this list when it works properly. When don't want users to change that...
      #p[:image_id] == "on" ? p.except(:image_id) : p
    end
end
