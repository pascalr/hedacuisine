class CreateIngredientSections < ActiveRecord::Migration[6.1]
  def change
    create_table :ingredient_sections do |t|
      t.string :name
      t.references :recipe, null: false, foreign_key: true
      t.integer :before_ing_nb

      t.timestamps
    end
  end
end
