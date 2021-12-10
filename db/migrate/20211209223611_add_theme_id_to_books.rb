class AddThemeIdToBooks < ActiveRecord::Migration[6.1]
  def change
    add_column :books, :theme_id, :integer
  end
end
