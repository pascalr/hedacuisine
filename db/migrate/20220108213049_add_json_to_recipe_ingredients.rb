class AddJsonToRecipeIngredients < ActiveRecord::Migration[6.1]
  def change
    add_column :recipe_ingredients, :comment_json, :text
    add_column :recipe_ingredients, :comment_html, :text
  end
end
