class AddJsonToArticles < ActiveRecord::Migration[6.1]
  def change
    add_column :articles, :json, :text
    add_column :articles, :html, :text
  end
end
