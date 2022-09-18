class CreateRecipeSteps < ActiveRecord::Migration[6.0]
  def change
    create_table :recipe_steps do |t|
      t.references :recipe, null: false, foreign_key: true
      t.references :step, null: false, foreign_key: true

      t.timestamps
    end
  end
end
