class CreateFrenchExpressions < ActiveRecord::Migration[6.1]
  def change
    create_table :french_expressions do |t|
      t.string :singular
      t.string :plural
      t.boolean :contract_preposition
      t.references :expression, null: false, foreign_key: true

      t.timestamps
    end
  end
end
