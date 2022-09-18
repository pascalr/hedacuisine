class CreateSimilarRecipes < ActiveRecord::Migration[6.0]
  def change
    create_table :similar_recipes do |t|
      t.references :recipe, null: false, foreign_key: true
      t.integer :similar_recipe_id

      t.timestamps
    end
  end
end
