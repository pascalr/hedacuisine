class AddJsonToRecipes < ActiveRecord::Migration[6.1]
  def change
    add_column :recipes, :json, :text
    add_column :recipes, :html, :text
  end
end
