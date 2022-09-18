class AddVersionNameToRecipes < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :version_name, :string
  end
end
