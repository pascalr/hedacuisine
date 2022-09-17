class DropRecipes < ActiveRecord::Migration[7.0]
  def change
    drop_table :recipes, force: :cascade, if_exists: true
  end
end
