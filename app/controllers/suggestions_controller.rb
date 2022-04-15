class SuggestionsController < ApplicationController
  #skip_before_action :authenticate_user!, only: [:test]
  skip_before_action :only_admin!, only: [:what_to_eat]

  def what_to_eat
    gon.recipe_filters = RecipeFilter.where(user_id: nil).or(current_user.recipe_filters).map {|f| f.to_obj }
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
    result = []
    collections.each do |collection|
      result += collection.offset(offset).limit(nbItems - result.size)
      break if result.size >= nbItems
    end
    return result
  end
  def index
    #occasion = params[:occasion]
    #recipes = _recipes_for_occasion(occasion)    
    filter_id = params[:filterId]
    suggestions = current_user.suggestions.all_valid.where(filter_id: filter_id, score: 0...).order(:score)
    recipes = current_user.recipes.left_outer_joins(:suggestions).where(suggestions: {id: nil})
    recipe_kinds = RecipeKind.left_outer_joins(:suggestions).where(suggestions: {id: nil})
    bad_suggestions = current_user.suggestions.all_valid.where(filter_id: filter_id, score: ...0).order(:score)
    collections = [suggestions, recipes, recipe_kinds, bad_suggestions]
    nbItems = 5 # items per page
    offset = ((params[:page].to_i || 1) - 1) * nbItems
    result = paginate_collections(collections, offset, nbItems)
    render json: result.map {|s|
      r = (s.is_a? Suggestion) ? s.about : s
      r.to_obj(only: [:name, :image_id])
    }
  end

  def data_to_train
    filter_id = params[:filterId]
    #current_user.suggestions.where()
    #recipes = current_user.recipes.left_outer_joins(:suggestions).where('recipe_kind_id IS NULL AND (suggestions.id IS NULL OR suggestions.filter_id != ?)', filter_id)
    recipes = current_user.recipes.left_outer_joins(:suggestions).where('suggestions.id IS NULL OR suggestions.filter_id != ?', filter_id)
    recipe_kinds = RecipeKind.left_outer_joins(:suggestions).where('suggestions.id IS NULL OR suggestions.filter_id != ?', filter_id)
    collections = [recipes, recipe_kinds]
    nbItems = 20 # items per batch
    offset = params[:offset] || 0
    result = paginate_collections(collections, offset, nbItems)
    render json: result.map {|s|
      r = (s.is_a? Suggestion) ? s.about : s
      r.to_obj(only: [:name, :image_id])
    }
  end

  def send_training_data
    filter_id = params[:filterId]
    skipped = params[:skipped] || []
    selected = params[:selected] || []
    skipped.each do |id|
      record = decode_record(id, filter_id)
      record.filtered = true
      record.save!
    end
    selected.each do |id|
      record = decode_record(id, filter_id)
      record.filtered = false
      record.save!
    end
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
