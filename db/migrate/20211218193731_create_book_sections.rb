class CreateBookSections < ActiveRecord::Migration[6.1]
  def change
    create_table :book_sections do |t|
      t.string :name
      t.references :book, null: false, foreign_key: true

      t.timestamps
    end
  end
end
