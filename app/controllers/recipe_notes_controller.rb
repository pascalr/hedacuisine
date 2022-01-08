class RecipeNotesController < ApplicationController
  before_action :set_recipe
  before_action :set_recipe_note, only: [:update, :destroy, :move]

  def create
    note = @recipe.recipe_notes.create(recipe_note_params)
    respond_to do |format|
      format.js {render json: {id: note.id, item_nb: note.item_nb, content: note.content, url: recipe_recipe_note_path(@recipe, note)}}
      format.html {redirect_back fallback_location: recipe_path(@recipe)}
    end
  end

  def move
    @recipe_note.insert_at(params[:item_nb].to_i)
    head :ok
  end

  def update
    @recipe_note.update!(recipe_note_params)
    redirect_back fallback_location: recipe_path(@recipe)
  end

  def destroy
    @recipe_note.destroy!
    redirect_back fallback_location: recipe_path(@recipe)
  end

  private
    
    def set_recipe
      @recipe = Recipe.find(params[:recipe_slug].split('-')[0])
    end

    def set_recipe_note
      @recipe_note = @recipe.recipe_notes.find(params[:id] || params[:recipe_note_id])
    end

    def recipe_note_params
      params.require(:recipe_note).permit(:item_nb, :content, :json, :html)
    end
end
