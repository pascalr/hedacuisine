class CreateReferences < ActiveRecord::Migration[6.1]
  def change
    create_table :references do |t|
      t.references :recipe, null: false, foreign_key: true
      t.string :raw

      t.timestamps
    end
  end
end
