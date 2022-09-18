class AddPreparationTimeCookingTimeAndServingsToRecipes < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :preparation_time, :integer
    add_column :recipes, :cooking_time, :integer
    add_column :recipes, :servings_quantity, :integer
    add_column :recipes, :servings_name, :string
  end
end
