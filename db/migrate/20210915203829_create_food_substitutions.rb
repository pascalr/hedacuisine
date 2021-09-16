class CreateFoodSubstitutions < ActiveRecord::Migration[6.0]
  def change
    create_table :food_substitutions do |t|
      t.references :food, null: false, foreign_key: true
      t.integer :substitute_id, null: false
      t.float :ratio

      t.timestamps
    end
  end
end
