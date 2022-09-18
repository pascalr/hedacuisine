class AddContainerNbToIngredients < ActiveRecord::Migration[6.0]
  def change
    add_column :ingredients, :container_nb, :integer
  end
end
