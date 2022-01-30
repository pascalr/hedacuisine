class IngredientSectionsController < ApplicationController
  before_action :set_recipe
  before_action :set_ingredient_section, only: [:update, :destroy, :move]

  def create
    section = @recipe.ingredient_sections.create(ingredient_section_params)
    respond_to do |format|
      format.json {render json: to_obj(section) }
      format.html {redirect_back fallback_location: recipe_path(@recipe)}
    end
  end

  def move
    #@ingredient_section.insert_at(params[:item_nb].to_i)
    head :ok
  end

  def update
    @ingredient_section.update!(ingredient_section_params)
    redirect_back fallback_location: recipe_path(@recipe)
  end

  def destroy
    @ingredient_section.destroy!
    respond_to do |format|
      format.json {render json: {}}
      format.html {redirect_back fallback_location: recipe_path(@recipe)}
    end
  end

  private
    
    def set_recipe
      @recipe = current_user.recipes.find(params[:recipe_slug].split('-')[0])
    end

    def set_ingredient_section
      @ingredient_section = @recipe.ingredient_sections.find(params[:id] || params[:ingredient_section_id])
    end

    def ingredient_section_params
      return {} unless params.key? :ingredient_section
      params.require(:ingredient_section).permit(:name, :before_ing_nb)
    end
end
