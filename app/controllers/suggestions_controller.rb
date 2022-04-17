class SuggestionsController < ApplicationController
  #skip_before_action :authenticate_user!, only: [:test]
  skip_before_action :only_admin!, only: [:app]

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
  def index
    filtered_recipes = FilteredRecipe.where(recipe_filter_id: params[:recipe_filter_id], match: true)
    recipe_ids = filtered_recipes.select {|f| f.filterable_type == "Recipe"}.map(&:filterable_id)
    recipe_kinds_ids = filtered_recipes.select {|f| f.filterable_type == "RecipeKind"}.map(&:filterable_id)
    suggestions = current_user.suggestions.where(filter_id: params[:recipe_filter_id], recipe_id: recipe_ids).or(current_user.suggestions.where(filter_id: params[:recipe_filter_id], recipe_kind_id: recipe_kinds_ids)).order(:score)
    nbItems = 5 # items per page MATCH WITH CLIENT CODE
    offset = ((params[:page].to_i || 1) - 1) * nbItems
    result = suggestions.offset(offset).limit(nbItems)
    # let's say there are 8 suggestions
    # we want 5 items
    # we want page 2
    # we have 20 fresh suggestions
    # we want suggestions 5 to 8 and 2 fresh suggestions
    # offset = 5
    if result.size < nbItems
      offset = [offset - suggestions.count, 0].max
      ids = suggestions.map(&:about_id)
      fresh_suggestions = filtered_recipes.reject {|f| ids.include?(f.filterable_id) }
      limit = nbItems - result.size - 1
      result += fresh_suggestions[0..limit]
    end
    ##occasion = params[:occasion]
    ##recipes = _recipes_for_occasion(occasion)    
    #filter_id = params[:filterId]
    #suggestions = current_user.suggestions.all_valid.where(filter_id: filter_id, score: 0...).order(:score)
    #recipes = current_user.recipes.left_outer_joins(:suggestions).where(suggestions: {id: nil})
    #recipe_kinds = RecipeKind.left_outer_joins(:suggestions).where(suggestions: {id: nil})
    #bad_suggestions = current_user.suggestions.all_valid.where(filter_id: filter_id, score: ...0).order(:score)
    #collections = [suggestions, recipes, recipe_kinds, bad_suggestions]
    #nbItems = 5 # items per page
    #offset = ((params[:page].to_i || 1) - 1) * nbItems
    #result = paginate_collections(collections, offset, nbItems)
    render json: result.map {|s|
      r = (s.is_a? Suggestion) ? s.about : s.filterable
      r.to_obj(only: [:name, :image_id])
    }
  end

  def send_data
    filter_id = params[:filterId]
    selected = decode_record(params[:selected], filter_id)
    selected.increment(:selected_count)
    selected.save!
    params[:skipped].each do |id|
      record = decode_record(id, filter_id)
      record.increment(:skip_count)
      record.save!
    end
  end
private
  def decode_record(id, filter_id)
    args = (id.start_with? "_") ? {recipe_id: id[1..-1]} : {recipe_kind_id: id}
    current_user.suggestions.find_or_create_by(args.merge({filter_id: filter_id}))
  end
end
