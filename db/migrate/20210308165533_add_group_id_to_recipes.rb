class AddGroupIdToRecipes < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :group_id, :integer
  end
end
