class AddQuartersToContainerQuantities < ActiveRecord::Migration[6.0]
  def change
    add_column :container_quantities, :full_qty_quarters, :integer
    add_column :container_quantities, :grocery_qty_quarters, :integer

    remove_column :container_quantities, :qty
    remove_column :container_quantities, :containable_id
    remove_column :container_quantities, :containable_type
    remove_column :container_quantities, :grocery_qty
    remove_column :container_quantities, :full_qty
  end
end
