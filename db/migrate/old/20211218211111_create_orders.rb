class CreateOrders < ActiveRecord::Migration[6.1]
  def change
    create_table :orders do |t|
      t.integer :position
      t.integer :orderable_id
      t.string :orderable_type

      t.timestamps
    end
  end
end
