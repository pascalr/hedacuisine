class CreateUserRecipes < ActiveRecord::Migration[6.0]
  def change
    create_table :user_recipes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :recipe, null: false, foreign_key: true
      t.references :user_recipe_category, foreign_key: true

      t.timestamps
    end
  end
end
