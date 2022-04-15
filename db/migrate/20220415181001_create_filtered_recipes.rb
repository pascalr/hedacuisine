class CreateFilteredRecipes < ActiveRecord::Migration[7.0]
  def change
    create_table :filtered_recipes do |t|
      t.integer :filterable_id
      t.string :filterable_type
      t.boolean :match
      t.references :recipe_filter, null: false, foreign_key: true

      t.timestamps
    end
  end
end
