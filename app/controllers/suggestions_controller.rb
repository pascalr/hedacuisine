class SuggestionsController < ApplicationController
  #skip_before_action :authenticate_user!, only: [:test]
  #skip_before_action :only_admin!, only: [:test]

  def what_to_eat
    gon.recipe_filters = current_user.recipe_filters.map {|f| f.to_obj }
  end

  def _recipes_for_occasion(occasion)
    # <button type="button" className="btn btn-primary">Repas pour toute la semaine</button>
    # <button type="button" className="btn btn-primary">Recette rapide de semaine</button>
    # <button type="button" className="btn btn-primary">Recevoir des invités</button>
    # <button type="button" className="btn btn-primary">Apporter à un potluck</button>
    # <button type="button" className="btn btn-primary">Emporter un repas pour la journée</button>
    # <button type="button" className="btn btn-primary">Un ingrédient près d'être périmé</button>
    # <button type="button" className="btn btn-primary">Se gâter</button>
    #case occasion.to_s
    #when "all_week" then
    #else
    #  raise "Unkown occasion " + occasion
    #end
  end
  def paginate_collections(collections, offset, nbItems)
  end
  def index
    #occasion = params[:occasion]
    #recipes = _recipes_for_occasion(occasion)    
    filter_id = nil
    suggestions = current_user.suggestions.where(filter_id: filter_id, score: 0...).order(:score)
    recipes = current_user.recipes.left_outer_joins(:suggestions).where(suggestions: {id: nil})
    recipe_kinds = RecipeKind.left_outer_joins(:suggestions).where(suggestions: {id: nil})
    bad_suggestions = current_user.suggestions.where(filter_id: filter_id, score: ...0).order(:score)
    collections = [suggestions, recipes, recipe_kinds, bad_suggestions]
    result = []
    nbItems = 5 # items per page
    offset = ((params[:page].to_i || 1) - 1) * nbItems
    collections.each do |collection|
      result += collection.offset(offset).limit(nbItems - result.size)
      break if result.size >= nbItems
    end
    render json: result.map {|s|
      r = (s.is_a? Suggestion) ? s.about : s
      r.to_obj(only: [:name, :image_id])
    }
  end

  def send_data
    selected = decode_record(params[:selected])
    selected.increment(:selected_count)
    selected.save!
    skipped = params[:skipped].each do |id|
      record = decode_record(id)
      record.increment(:skip_count)
      record.save!
    end
  end
private
  def decode_record(id)
    args = (id.start_with? "_") ? {recipe_id: id[1..-1]} : {recipe_kind_id: id}
    current_user.suggestions.find_or_create_by(args)
  end
end
