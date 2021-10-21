class AddParentIdToRecipes < ActiveRecord::Migration[6.1]
  def change
    add_column :recipes, :kind_id, :integer
  end
end
