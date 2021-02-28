class CreateDescriptions < ActiveRecord::Migration[6.0]
  def change
    create_table :descriptions do |t|
      t.text :content
      t.references :language, null: false, foreign_key: true
      t.integer :described_id
      t.string :described_type

      t.timestamps
    end
  end
end
