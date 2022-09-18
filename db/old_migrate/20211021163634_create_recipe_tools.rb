class CreateRecipeTools < ActiveRecord::Migration[6.1]
  def change
    create_table :recipe_tools do |t|
      t.references :recipe, null: false, foreign_key: true
      t.references :tool, null: false, foreign_key: true

      t.timestamps
    end
  end
end
