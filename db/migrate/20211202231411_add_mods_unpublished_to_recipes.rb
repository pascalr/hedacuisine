class AddModsUnpublishedToRecipes < ActiveRecord::Migration[6.1]
  def change
    add_column :recipes, :mods_unpublished, :boolean
  end
end
