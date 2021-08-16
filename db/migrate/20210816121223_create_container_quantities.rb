class CreateContainerQuantities < ActiveRecord::Migration[6.0]
  def change
    create_table :container_quantities do |t|
      t.string :qty
      t.references :container_format, null: false, foreign_key: true
      t.integer :containable_id
      t.string :containable_type

      t.timestamps
    end
  end
end
