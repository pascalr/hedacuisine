class CreateRecipeFilters < ActiveRecord::Migration[7.0]
  def change
    create_table :recipe_filters do |t|
      t.string :name
      t.integer :image_id
      t.integer :user_id

      t.timestamps
    end
  end
end
