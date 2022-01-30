class IngredientSectionsController < ApplicationController
  before_action :set_recipe
  before_action :set_ingredient_section, only: [:update, :destroy, :move]

  def create
    note = @recipe.ingredient_sections.create(ingredient_section_params)
    respond_to do |format|
      format.js {render json: {id: note.id, item_nb: note.item_nb, content: note.content, url: recipe_ingredient_section_path(@recipe, note)}}
      format.html {redirect_back fallback_location: recipe_path(@recipe)}
    end
  end

  def move
    @ingredient_section.insert_at(params[:item_nb].to_i)
    head :ok
  end

  def update
    @ingredient_section.update!(ingredient_section_params)
    redirect_back fallback_location: recipe_path(@recipe)
  end

  def destroy
    @ingredient_section.destroy!
    redirect_back fallback_location: recipe_path(@recipe)
  end

  private
    
    def set_recipe
      @recipe = current_user.recipes.find(params[:recipe_slug].split('-')[0])
    end

    def set_ingredient_section
      @ingredient_section = @recipe.ingredient_sections.find(params[:id] || params[:ingredient_section_id])
    end

    def ingredient_section_params
      params.require(:ingredient_section).permit(:name, :before_ing_nb)
    end
end
