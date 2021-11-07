json.recipe do
  json.id @recipe.id
  json.name @recipe.name
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

json.foodList Food.all, :name
