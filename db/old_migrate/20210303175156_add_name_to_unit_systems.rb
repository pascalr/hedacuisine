class AddNameToUnitSystems < ActiveRecord::Migration[6.0]
  def change
    add_column :unit_systems, :name, :string
  end
end
