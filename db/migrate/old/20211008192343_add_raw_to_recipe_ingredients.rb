class AddRawToRecipeIngredients < ActiveRecord::Migration[6.1]
  def change
    add_column :recipe_ingredients, :raw, :string
  end
end
