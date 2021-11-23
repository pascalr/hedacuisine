namespace :once do

  task base_recipe_to_kind: :environment do
    Recipe.all.each do |recipe|
      if !recipe.recipe_kind && recipe.base_recipe
        recipe.recipe_kind = recipe.base_recipe.recipe_kind
        recipe.save!
      end
    end
  end
  
  task recipe_kinds: :environment do
    Recipe.with_images.each do |recipe|
      k = RecipeKind.new
      k.name = recipe.name
      k.description = recipe.description
      k.image_id = recipe.image_id
      k.kind_id = recipe.kind_id
      k.save!
      recipe.recipe_kind = k
      recipe.save!
    end
  end

  task sections_position: :environment do
    Section.all.each_with_index do |section, i|
      section.update!({position: i+1})
    end
  end

  desc "TODO"
  task set_recipe_ingredients_raw: :environment do
    RecipeIngredient.all.each do |ing|
      ing.update!(raw: ing.raw_quantity)
    end
  end

  desc "TODO"
  task source_to_references: :environment do
    Recipe.all.each do |recipe|
      recipe.references.create(raw: recipe.source) unless recipe.source.blank?
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
  
  desc "TODO"
  task remove_food_bad_data: :environment do
    Food.all.each do |f|
      f.unit_weight = nil if f.unit_weight && f.unit_weight > 1000.0
      f.density = nil if f.density == 1.0
      f.save!
    end
  end

end
