class CreateRecipeIngredients < ActiveRecord::Migration[6.0]
  def change
    create_table :recipe_ingredients do |t|
      t.references :recipe, null: false, foreign_key: true
      t.references :food, null: false, foreign_key: true
      t.float :quantity
      t.references :unit, foreign_key: true
      t.integer :item_nb

      t.timestamps
    end
  end
end
