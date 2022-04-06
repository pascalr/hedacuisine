class SuggestionsController < ApplicationController
  #skip_before_action :authenticate_user!, only: [:test]
  #skip_before_action :only_admin!, only: [:test]

  def what_to_eat
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
  def index
    #occasion = params[:occasion]
    #recipes = _recipes_for_occasion(occasion)    
    collection = RecipeKind.all
    items = 5 # items per page
    offset = ((params[:page].to_i || 1) - 1) * items
    suggestions = collection.offset(offset).limit(items)
    render json: suggestions.map {|s| s.to_obj(only: [:name, :image_id])}
  end

  def send_data
    selected = decode_record(params[:selected])
    selected.increment!(:selected_count)
    skipped = params[:skipped].each do |id|
      record = decode_record(id)
      record.increment!(:skip_count)
    end
  end
private
  def decode_record(id)
    args = (id.start_with? "_") ? {recipe_id: id} : {recipe_kind_id: id}
    current_user.suggestions.find_or_create_by(args)
  end
end
