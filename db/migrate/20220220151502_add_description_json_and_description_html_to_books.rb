class AddDescriptionJsonAndDescriptionHtmlToBooks < ActiveRecord::Migration[6.1]
  def change
    add_column :books, :description_json, :string
    add_column :books, :description_html, :string
  end
end
