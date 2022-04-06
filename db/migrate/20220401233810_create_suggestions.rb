class CreateSuggestions < ActiveRecord::Migration[7.0]
  def change
    create_table :suggestions do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :recipe_id
      t.integer :recipe_kind_id
      t.integer :filter_id
      t.integer :skip_count
      t.integer :selected_count
      t.float :score

      t.timestamps
    end
  end
end
