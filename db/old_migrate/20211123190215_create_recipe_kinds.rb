class CreateRecipeKinds < ActiveRecord::Migration[6.1]
  def change
    create_table :recipe_kinds do |t|
      t.string :name
      t.text :description
      t.integer :image_id

      t.timestamps
    end
  end
end
