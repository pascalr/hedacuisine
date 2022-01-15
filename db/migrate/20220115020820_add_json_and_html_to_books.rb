class AddJsonAndHtmlToBooks < ActiveRecord::Migration[6.1]
  def change
    add_column :books, :json, :text
    add_column :books, :html, :text
  end
end
