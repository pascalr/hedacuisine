json.recipe do
  json.id @recipe.id
  json.content @recipe.content
  json.url recipe_path(@recipe)
  json.new_ingredient_url recipe_recipe_ingredients_path(@recipe)
  json.name @recipe.name
  json.main_ingredient_id @recipe.main_ingredient_id
  json.complete_instructions @recipe.complete_instructions
  json.base_recipe_id @recipe.base_recipe_id
  json.preparation_time @recipe.preparation_time
  json.cooking_time @recipe.cooking_time
  json.total_time @recipe.total_time
  json.raw_servings @recipe.raw_servings
  json.move_ing_url move_ing_recipe_path(@recipe)
  json.ingredients do
    @recipe.ingredients.order(:item_nb).each do |ing|
      json.set! ing.id do
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
  end 
  json.tools @recipe.tools.inject({}) {|tools_by_id, tool| tools_by_id[tool.id] = {name: tool.name}; tools_by_id }
end

json.units Unit.all, :name, :value, :is_weight, :is_volume, :show_fraction

#json.foodList Food.all.map(&:name)
#json.foodList Food.all.map {|food| {label: food.name}}
json.foodList Food.all.map {|food| {id: food.id, name: food.name.downcase}}
