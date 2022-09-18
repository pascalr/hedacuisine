class CreateGroceryItems < ActiveRecord::Migration[6.0]
  def change
    create_table :grocery_items do |t|
      t.string :description
      t.references :machine, null: false, foreign_key: true

      t.timestamps
    end
  end
end
