class AddJsonToRecipeNotes < ActiveRecord::Migration[6.1]
  def change
    add_column :recipe_notes, :json, :text
    add_column :recipe_notes, :html, :text
  end
end
