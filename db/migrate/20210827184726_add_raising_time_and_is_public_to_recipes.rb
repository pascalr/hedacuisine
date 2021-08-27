class AddRaisingTimeAndIsPublicToRecipes < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :total_time, :integer
    add_column :recipes, :is_public, :boolean
  end
end
