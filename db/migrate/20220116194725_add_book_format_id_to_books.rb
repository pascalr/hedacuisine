class AddBookFormatIdToBooks < ActiveRecord::Migration[6.1]
  def change
    add_column :books, :book_format_id, :integer
    add_column :books, :front_page_image_id, :integer
    add_column :books, :front_page_text_color, :integer
    add_column :books, :hide_front_page_text, :boolean
  end
end
