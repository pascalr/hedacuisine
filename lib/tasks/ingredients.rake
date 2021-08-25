def get_quantity_and_unit(ing)
  return nil, nil if ing.volume.blank?
  return ing.volume/1000.0, Unit.find_by(name: "L") if ing.food.is_liquid? && ing.volume >= 1000.0
  return ing.volume/250.0, Unit.find_by(name: "t") if ing.volume >= 60.0
  return ing.volume/15.0, Unit.find_by(name: "c. à soupe") if ing.volume >= 15.0
  return ing.volume/5.0, Unit.find_by(name: "c. à thé") if ing.volume >= 5.0/8.0
  return ing.volume/0.31, Unit.find_by(name: "pincée")
end

namespace :ingredients do
  desc "TODO"
  task convert: :environment do
    RecipeIngredient.destroy_all
    Ingredient.all.each do |ing|
      r = RecipeIngredient.new
      r.recipe = ing.recipe
      r.food = ing.food
      if r.food.is_unitary
        r.quantity = ing.weight / ing.food.unit_weight
      else
        qty, unit = get_quantity_and_unit(ing)
        r.quantity = qty
        r.unit = unit
      end
      r.item_nb = ing.nb
      r.save!
    end
  end
end
