class AddNbToIngredients < ActiveRecord::Migration[6.0]
  def change
    add_column :ingredients, :nb, :integer
  end
end
