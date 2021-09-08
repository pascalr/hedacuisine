class AddIsVegetarianAndIsVeganToRecipes < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :is_vegetarian, :boolean
    add_column :recipes, :is_vegan, :boolean
  end
end
