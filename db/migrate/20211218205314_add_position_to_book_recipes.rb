class AddPositionToBookRecipes < ActiveRecord::Migration[6.1]
  def change
    add_column :book_recipes, :position, :integer
  end
end
