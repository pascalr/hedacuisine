class RecipeKindsController < ApplicationController
  before_action :set_recipe_kind, only: %i[ show edit update destroy search_recipe ]
  skip_before_action :authenticate_user!, only: [:show]
  skip_before_action :only_admin!, only: [:show]

  def index
    @recipe_kinds = RecipeKind.all
  end

  def show
    @recipes = @recipe_kind.recipes.where(is_public: true).or(@recipe_kind.recipes.where(user_id: current_user_id))
    if params[:version].blank? and !@recipes.blank?
      return redirect_to recipe_kind_path(@recipe_kind, version: @recipes.first.id)
    end
    if current_user
      # FIXME: Does the or prioritize the first one? It should
      recipes = @recipe_kind.recipes.where(is_public: true).or(@recipe_kind.recipes.where(user_id: current_user_id))
    else
      recipes = @recipe_kind.recipes.all_public
    end
    @recipe = recipes.find(params[:version]) if params[:version]
    gon.jbuilder
  end

  def search_recipe
    render partial: "recipe_kinds/search_recipe", locals: {recipe_kind: @recipe_kind}
  end

  def edit
    gon.foodList = Food.all.map {|food| {id: food.id, name: food.name.downcase, url: food_path(food)}}
    gon.recipe_kind = to_obj(@recipe_kind)
  end

  def new
    @recipe_kind = RecipeKind.new
  end

  def create
    @recipe_kind = RecipeKind.new(recipe_kind_params)
    @recipe_kind.save!
    redirect_to edit_recipe_kind_path(@recipe_kind)
  end

  def update
    @recipe_kind.update!(recipe_kind_params)
    respond_to do |format|
      format.json {render json: to_obj(@recipe_kind)}
      format.html {redirect_back fallback_location: edit_recipe_kind_path(@recipe_kind)}
    end
  end

  def destroy
    @recipe_kind.destroy
    respond_to do |format|
      format.json {render json: {}}
      format.html {redirect_back fallback_location: recipe_kinds_path}
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_recipe_kind
      @recipe_kind = RecipeKind.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def recipe_kind_params
      params.require(:recipe_kind).permit(:name, :description, :image_id, :description_json, :description_html)
    end
end
