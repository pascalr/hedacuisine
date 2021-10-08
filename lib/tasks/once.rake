namespace :once do
  desc "TODO"
  task set_recipe_ingredients_raw: :environment do
    RecipeIngredient.all.each do |ing|
      ing.update!(raw: ing.raw_quantity)
    end
  end

end
