class AddRecipeKindIdToRecipes < ActiveRecord::Migration[6.1]
  def change
    add_column :recipes, :recipe_kind_id, :integer
  end
end
