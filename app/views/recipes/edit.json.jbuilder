json.recipe do
  json.id @recipe.id
  json.class_name "recipe"
  json.url recipe_path(@recipe)
  json.new_ingredient_url recipe_recipe_ingredients_path(@recipe)
  json.new_note_url recipe_recipe_notes_path(@recipe)
  json.name @recipe.name
  json.recipe_kind_id @recipe.recipe_kind_id
  json.main_ingredient_id @recipe.main_ingredient_id
  json.complete_instructions @recipe.complete_instructions
  json.base_recipe_id @recipe.base_recipe_id
  json.preparation_time @recipe.preparation_time
  json.cooking_time @recipe.cooking_time
  json.total_time @recipe.total_time
  json.raw_servings @recipe.raw_servings
  json.move_ing_url move_ing_recipe_path(@recipe)
  json.json @recipe.json
  json.use_personalised_image !!@recipe.use_personalised_image
  if @recipe.recipe_image
    json.recipe_image do
      json.class_name "image"
      json.url image_path(@recipe.recipe_image)
      json.path @application_controller.image_variant_path(@recipe.recipe_image, :medium)
      json.is_user_author !!@recipe.recipe_image.is_user_author
    end
  end
  if @recipe.recipe_kind && @recipe.recipe_kind.image
    json.recipe_kind_image do
      json.path @application_controller.image_variant_path(@recipe.recipe_kind.image, :medium)
    end
  end
  #json.image_path @application_controller.image_variant_path(@recipe.image, :medium)
  json.notes do
    @recipe.notes.order(:item_nb).each do |note|
      json.set! note.id do
        json.id note.id
        json.item_nb note.item_nb
        json.html note.html
        json.json note.json
        json.url recipe_recipe_note_path(@recipe, note)
      end
    end
  end
  json.ingredients do
    @recipe.ingredients.order(:item_nb).each do |ing|
      json.set! ing.id do
        json.id ing.id
        json.item_nb ing.item_nb
        json.raw ing.raw
        json.comment_json ing.comment_json
        json.url recipe_recipe_ingredient_path(@recipe, ing)
        json.name ing.name
        if ing.food
          json.food do
            json.id ing.food.id
            json.name ing.food.name
            json.url food_path(ing.food)
          end
        end
      end
    end
  end 
  json.tools @recipe.tools.inject({}) {|tools_by_id, tool| tools_by_id[tool.id] = {name: tool.name}; tools_by_id }
end

json.units Unit.all, :name, :value, :is_weight, :is_volume, :show_fraction

#json.foodList Food.all.map(&:name)
#json.foodList Food.all.map {|food| {label: food.name}}
#json.foodList Food.all.map {|food| {id: food.id, name: food.name.downcase}}
json.foodList Food.all.map {|food| {id: food.id, name: food.name.downcase, url: food_path(food)}}

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
