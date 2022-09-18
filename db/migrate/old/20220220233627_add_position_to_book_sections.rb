class AddPositionToBookSections < ActiveRecord::Migration[6.1]
  def change
    add_column :book_sections, :position, :integer
  end
end
