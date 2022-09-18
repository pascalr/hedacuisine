class AddIsGlutenFreeToRecipes < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :is_gluten_free, :boolean
  end
end
