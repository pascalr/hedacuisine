class AddBackgroundColorToBooks < ActiveRecord::Migration[6.1]
  def change
    add_column :books, :background_color, :integer
  end
end
