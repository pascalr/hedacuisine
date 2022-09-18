class AddMainIngredientIdToRecipes < ActiveRecord::Migration[6.1]
  def change
    add_column :recipes, :main_ingredient_id, :integer
  end
end
