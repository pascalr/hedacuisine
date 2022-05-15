class AddListIdToFavoriteRecipes < ActiveRecord::Migration[7.0]
  def change
    add_column :favorite_recipes, :list_id, :integer
  end
end
