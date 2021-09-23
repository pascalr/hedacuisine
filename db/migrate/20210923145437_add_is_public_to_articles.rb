class AddIsPublicToArticles < ActiveRecord::Migration[6.0]
  def change
    add_column :articles, :is_public, :boolean
  end
end
