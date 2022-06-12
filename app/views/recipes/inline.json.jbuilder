json.units Unit.all, :name, :value, :is_weight, :is_volume, :show_fraction
json.ingredients @recipe.ingredients.inject({}) {|ings, i|
  qty = i.quantity_model
  if i.food
    ings[i.id] = {ml: qty.ml, grams: qty.grams, total: qty.total, unit_weight: i.food.unit_weight, density: i.food.density, food_id: i.food.id, food_name: i.food.name, food_plural: i.food.plural, raw: i.raw, comment: i.comment_html}
  else
    ings[i.id] = {ml: qty.ml, grams: qty.grams, total: qty.total, raw: i.raw, comment: i.comment_html}
  end
  ings
}

if @recipe.recipe_kind
  versions = @recipe.recipe_kind ? @recipe.recipe_kind.recipes : []
  json.pages versions do |version|
    json.id version.id
    json.url page_recipe_path(version)
  end
  json.current_page versions.index(@recipe) + 1
end

json.recipe_servings_quantity @recipe.servings_quantity
