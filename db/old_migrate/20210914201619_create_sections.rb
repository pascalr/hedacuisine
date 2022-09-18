class CreateSections < ActiveRecord::Migration[6.0]
  def change
    create_table :sections do |t|
      t.references :article, null: false, foreign_key: true
      t.text :content
      t.integer :position
      t.string :title

      t.timestamps
    end
  end
end
