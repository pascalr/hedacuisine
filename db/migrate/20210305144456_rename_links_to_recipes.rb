class RenameLinksToRecipes < ActiveRecord::Migration[6.0]
  def change
    rename_table :links, :recipes
  end
end
