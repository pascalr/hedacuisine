class CreateUnitSystemItems < ActiveRecord::Migration[6.0]
  def change
    create_table :unit_system_items do |t|
      t.references :unit, null: false, foreign_key: true
      t.references :unit_system, null: false, foreign_key: true

      t.timestamps
    end
  end
end
