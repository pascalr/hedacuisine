class DropUserRecipes < ActiveRecord::Migration[7.0]
  def up
    drop_table :user_recipes
    drop_table :user_recipe_categories
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
