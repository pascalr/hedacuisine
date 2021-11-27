json.recipe_kind do
  json.id @recipe_kind.id
  json.name @recipe_kind.name
  json.description @recipe_kind.description
  json.url recipe_kind_path(@recipe_kind)
end

json.foodList Food.all.map {|food| {id: food.id, name: food.name.downcase, url: food_path(food)}}
