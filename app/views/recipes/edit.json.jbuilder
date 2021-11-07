json.recipe do
  json.id @recipe.id
  json.name @recipe.name
  json.ingredients @recipe.ingredients.order(:item_nb) do |ing|
    json.id ing.id
    json.item_nb ing.item_nb
    json.raw ing.raw
    json.comment ing.comment
    json.food ing.food, :id, :name
  end
end

json.foodList Food.all, :name

json.assetPath do
  #json.arrowsMove asset_path("arrows-move.svg")
  json.arrowsMove ActionController::Base.helpers.asset_path("arrows-move.svg")
end
