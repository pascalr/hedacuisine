class CreateFoodPreferences < ActiveRecord::Migration[6.0]
  def change
    create_table :food_preferences do |t|
      t.references :food, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.integer :preference
      t.integer :availability

      t.timestamps
    end
  end
end
