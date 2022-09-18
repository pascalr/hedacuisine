class CreateUnits < ActiveRecord::Migration[6.0]
  def change
    create_table :units do |t|
      t.string :name
      t.float :value
      t.boolean :is_weight
      t.boolean :is_volume
      t.boolean :show_fraction
      t.references :language, null: false, foreign_key: true

      t.timestamps
    end
  end
end
