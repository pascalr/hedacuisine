class AddColorsToThemes < ActiveRecord::Migration[6.1]
  def change
    add_column :themes, :inverted_background_color, :integer
    add_column :themes, :inverted_text_color, :integer
    add_column :themes, :link_color, :integer
  end
end
