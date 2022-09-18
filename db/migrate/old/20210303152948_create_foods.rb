class CreateFoods < ActiveRecord::Migration[6.0]
  def change
    create_table :foods do |t|
      t.string :name
      t.float :density
      t.float :unit_weight
      t.integer :color
      t.boolean :is_liquid

      t.timestamps
    end
  end
end
