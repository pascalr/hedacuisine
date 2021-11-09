json.recipe do
  json.id @recipe.id
  json.url recipe_path(@recipe)
  json.new_ingredient_url recipe_recipe_ingredients_path(@recipe)
  json.name @recipe.name
  json.move_ing_url move_ing_recipe_path(@recipe)
  json.ingredients @recipe.ingredients.order(:item_nb) do |ing|
    json.id ing.id
    json.item_nb ing.item_nb
    json.raw ing.raw
    json.comment ing.comment
    json.url recipe_recipe_ingredient_path(@recipe, ing)
    json.food do
      json.id ing.food.id
      json.name ing.food.name
      json.url food_path(ing.food)
    end
  end
end


#json.foodList Food.all.map(&:name)
#json.foodList Food.all.map {|food| {label: food.name}}
json.foodList Food.all.map {|food| {id: food.id, name: food.name.downcase}}
