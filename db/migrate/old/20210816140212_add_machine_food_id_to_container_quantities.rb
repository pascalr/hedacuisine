class AddMachineFoodIdToContainerQuantities < ActiveRecord::Migration[6.0]
  def change
    add_column :container_quantities, :machine_food_id, :integer
  end
end
