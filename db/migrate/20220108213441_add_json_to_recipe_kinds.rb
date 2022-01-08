class AddJsonToRecipeKinds < ActiveRecord::Migration[6.1]
  def change
    add_column :recipe_kinds, :description_json, :text
    add_column :recipe_kinds, :description_html, :text
  end
end
