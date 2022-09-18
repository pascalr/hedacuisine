class FixRecipes < ActiveRecord::Migration[6.0]
  def self.up
    drop_table(:recipes, if_exists: true)
  end
end
