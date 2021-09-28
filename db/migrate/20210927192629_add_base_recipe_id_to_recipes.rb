class AddBaseRecipeIdToRecipes < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :base_recipe_id, :integer
  end
end
