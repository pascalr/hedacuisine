class AddParentIdToMenus < ActiveRecord::Migration[6.0]
  def change
    add_column :menus, :parent_id, :integer
  end
end
