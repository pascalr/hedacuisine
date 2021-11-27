class DropIngredients < ActiveRecord::Migration[6.1]
  def up
    drop_table :ingredients
  end
end
