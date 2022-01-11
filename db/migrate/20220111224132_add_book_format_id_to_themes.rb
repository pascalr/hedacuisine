class AddBookFormatIdToThemes < ActiveRecord::Migration[6.1]
  def change
    add_column :themes, :book_format_id, :integer
  end
end
