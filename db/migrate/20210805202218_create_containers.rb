class CreateContainers < ActiveRecord::Migration[6.0]
  def change
    create_table :containers do |t|
      t.references :container_format, null: false, foreign_key: true
      t.references :machine, null: false, foreign_key: true
      t.integer :jar_id

      t.timestamps
    end
  end
end
