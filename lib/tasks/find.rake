namespace :find do
  desc "TODO"
  task similar_recipes: :environment do
    SimilarRecipe.destroy_all
    recipes = Recipe.all.to_a
    total = 0
    recipes.each do |recipe|
      recipes.each do |other|
        next if recipe.id == other.id
        if recipe.name.include? other.name
          SimilarRecipe.create!(recipe: recipe, similar_recipe: other)
          total += 1
        end
      end
    end
    puts "Found #{total} similar recipes in total."
  end

end
