class CreatePageTexts < ActiveRecord::Migration[6.1]
  def change
    create_table :page_texts do |t|
      t.references :page, null: false, foreign_key: true
      t.text :json
      t.text :html
      t.float :x_mm
      t.float :y_mm

      t.timestamps
    end
  end
end
