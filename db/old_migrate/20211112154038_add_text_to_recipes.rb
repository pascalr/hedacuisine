class AddTextToRecipes < ActiveRecord::Migration[6.1]
  def change
    add_column :recipes, :text, :text
  end
end
