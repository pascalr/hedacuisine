namespace :once do
  desc "TODO"
  task set_recipe_ingredients_raw: :environment do
    RecipeIngredient.all.each do |ing|
      ing.update!(raw: ing.raw_quantity)
    end
  end
  
  desc "TODO"
  task set_recipes_version_nb: :environment do
    Recipe.where(base_recipe_id: nil).each do |recipe|
      recipe.update!(version_nb: 1)
      recipe.variants.each_with_index do |var, i|
        var.update!(version_nb: i+2)
      end
    end
  end
  
  desc "TODO"
  task food_names_to_expressions: :environment do
    Expression.destroy_all
    FrenchExpression.destroy_all
    Food.all.each do |f|
      e = Expression.create!(default: f.name)
      f.expression = e
      f.save!
      e.create_french_expression!(singular: f.name, plural: f.plural)
    end
  end

end
