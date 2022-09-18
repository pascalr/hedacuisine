class CreatePages < ActiveRecord::Migration[6.1]
  def change
    create_table :pages do |t|
      t.references :book, null: false, foreign_key: true
      t.integer :page_nb

      t.timestamps
    end
  end
end
