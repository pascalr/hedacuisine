class AddModsPublishedToRecipes < ActiveRecord::Migration[6.1]
  def change
    add_column :recipes, :mods_published, :boolean
  end
end
