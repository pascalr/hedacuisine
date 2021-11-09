json.units Unit.all, :name, :value, :is_weight, :is_volume, :show_fraction
json.ingredients @recipe.ingredients.inject({}) {|ings, i|
  qty = i.quantity_model; ings[i.id] = {ml: qty.ml, grams: qty.grams, total: qty.total, unit_weight: i.food.unit_weight, density: i.food.density, raw: i.raw}; ings
}
