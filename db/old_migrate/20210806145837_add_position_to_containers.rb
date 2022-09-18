class AddPositionToContainers < ActiveRecord::Migration[6.0]
  def change
    add_column :containers, :pos_x, :float
    add_column :containers, :pos_y, :float
    add_column :containers, :pos_z, :float
  end
end
