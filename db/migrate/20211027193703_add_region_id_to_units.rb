class AddRegionIdToUnits < ActiveRecord::Migration[6.1]
  def change
    add_column :units, :region_id, :integer
  end
end
