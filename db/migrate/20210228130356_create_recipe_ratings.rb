class CreateRecipeRatings < ActiveRecord::Migration[6.0]
  def change
    create_table :recipe_ratings do |t|
      t.float :rating
      t.references :recipe, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
