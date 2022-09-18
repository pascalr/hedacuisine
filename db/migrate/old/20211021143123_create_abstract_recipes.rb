class CreateAbstractRecipes < ActiveRecord::Migration[6.1]
  def change
    create_table :kinds do |t|
      t.string :name
      t.integer :image_id
      t.text :description

      t.timestamps
    end
  end
end
