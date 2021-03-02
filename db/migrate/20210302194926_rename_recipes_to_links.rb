class RenameRecipesToLinks < ActiveRecord::Migration[6.0]
  def change
    #rename_table :[old_table_name], :[new_table_name]
    rename_table :recipes, :links
    drop_table(:recipes, if_exists: true)
  end
end
