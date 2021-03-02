class RenameRecipesToLinks < ActiveRecord::Migration[6.0]
  def self.up
    rename_table :recipes, :links
  end
  def self.down
    rename_table :links, :recipes
  end
end
