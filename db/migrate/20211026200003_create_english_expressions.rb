class CreateEnglishExpressions < ActiveRecord::Migration[6.1]
  def change
    create_table :english_expressions do |t|
      t.string :singular
      t.string :plural
      t.references :expression, null: false, foreign_key: true

      t.timestamps
    end
  end
end
