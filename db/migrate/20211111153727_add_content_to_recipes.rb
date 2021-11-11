class AddContentToRecipes < ActiveRecord::Migration[6.1]
  def change
    add_column :recipes, :content, :text
  end
end
