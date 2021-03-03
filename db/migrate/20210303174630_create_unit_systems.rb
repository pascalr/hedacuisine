class CreateUnitSystems < ActiveRecord::Migration[6.0]
  def change
    create_table :unit_systems do |t|

      t.timestamps
    end
  end
end
