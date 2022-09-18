class CreateRecipeComments < ActiveRecord::Migration[6.0]
  def change
    create_table :recipe_comments do |t|
      t.text :content
      t.references :recipe, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
