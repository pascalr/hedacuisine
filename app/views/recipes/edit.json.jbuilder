json.units Unit.all, :name, :value, :is_weight, :is_volume, :show_fraction

json.foodList Food.order(:name).all.map {|food| {id: food.id, name: food.name.downcase, url: food_path(food)}}

json.contractionList FrenchExpression.where(contract_preposition: true).map(&:singular)

json.recipe_kinds RecipeKind.order(:name).all do |recipe_kind|
  json.id recipe_kind.id
  json.name recipe_kind.name
  json.url recipe_kind_path(recipe_kind)
end 
  
json.noteList @recipe.notes do |note|
  json.id note.id
  json.item_nb note.item_nb
end
