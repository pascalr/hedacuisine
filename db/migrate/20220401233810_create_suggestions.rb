class CreateSuggestions < ActiveRecord::Migration[7.0]
  def change
    create_table :suggestions do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :recipe_id
      t.integer :recipe_kind_id
      t.float :all_week_score

      t.timestamps
    end
  end
end
