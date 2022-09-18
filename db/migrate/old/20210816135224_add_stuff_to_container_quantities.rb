class AddStuffToContainerQuantities < ActiveRecord::Migration[6.0]
  def change
    add_column :container_quantities, :grocery_qty, :integer
    add_column :container_quantities, :full_qty, :integer
  end
end
