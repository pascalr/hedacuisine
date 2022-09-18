class AddNameToRecipeIngredient < ActiveRecord::Migration[6.1]
  def change
    add_column :recipe_ingredients, :raw_food, :string
  end
end
