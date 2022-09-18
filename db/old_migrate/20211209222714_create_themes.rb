class CreateThemes < ActiveRecord::Migration[6.1]
  def change
    create_table :themes do |t|
      t.string :name
      t.integer :background_color
      t.integer :text_color
      t.string :font_name
      t.integer :page_separator_color

      t.timestamps
    end
  end
end
