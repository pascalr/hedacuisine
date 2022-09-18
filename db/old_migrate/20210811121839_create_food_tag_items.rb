class CreateFoodTagItems < ActiveRecord::Migration[6.0]
  def change
    create_table :food_tag_items do |t|
      t.references :food_tag, null: false, foreign_key: true
      t.references :food, null: false, foreign_key: true

      t.timestamps
    end
  end
end
