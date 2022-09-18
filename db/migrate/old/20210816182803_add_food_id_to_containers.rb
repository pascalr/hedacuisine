class AddFoodIdToContainers < ActiveRecord::Migration[6.0]
  def change
    add_column :containers, :food_id, :integer
  end
end
