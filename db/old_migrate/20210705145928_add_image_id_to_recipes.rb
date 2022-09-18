class AddImageIdToRecipes < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :image_id, :integer
  end
end
