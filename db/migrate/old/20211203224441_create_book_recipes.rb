class CreateBookRecipes < ActiveRecord::Migration[6.1]
  def change
    create_table :book_recipes do |t|
      t.references :recipe, null: false, foreign_key: true
      t.references :book, null: false, foreign_key: true

      t.timestamps
    end
  end
end
