class AddVersionNbToRecipes < ActiveRecord::Migration[6.1]
  def change
    add_column :recipes, :version_nb, :integer
  end
end
