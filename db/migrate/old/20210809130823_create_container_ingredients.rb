class CreateContainerIngredients < ActiveRecord::Migration[6.0]
  def change
    create_table :container_ingredients do |t|
      t.references :container, null: false, foreign_key: true
      t.references :food, null: false, foreign_key: true
      t.float :weight

      t.timestamps
    end
  end
end
