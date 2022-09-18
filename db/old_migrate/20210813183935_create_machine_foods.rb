class CreateMachineFoods < ActiveRecord::Migration[6.0]
  def change
    create_table :machine_foods do |t|
      t.references :machine, null: false, foreign_key: true
      t.references :food, null: false, foreign_key: true
      t.float :grocery_threshold

      t.timestamps
    end
  end
end
