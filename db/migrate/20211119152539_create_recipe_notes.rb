class CreateRecipeNotes < ActiveRecord::Migration[6.1]
  def change
    create_table :recipe_notes do |t|
      t.string :content
      t.integer :item_nb
      t.references :recipe, null: false, foreign_key: true

      t.timestamps
    end
  end
end
