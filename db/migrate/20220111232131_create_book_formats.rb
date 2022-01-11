class CreateBookFormats < ActiveRecord::Migration[6.1]
  def change
    create_table :book_formats, if_not_exists: true do |t|
      t.string :name
      t.float :page_width_mm
      t.float :page_height_mm

      t.timestamps
    end
  end
end
