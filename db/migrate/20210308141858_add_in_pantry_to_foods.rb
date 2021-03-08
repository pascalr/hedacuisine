class AddInPantryToFoods < ActiveRecord::Migration[6.0]
  def change
    add_column :foods, :in_pantry, :boolean
  end
end
