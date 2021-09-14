class AddIntroToArticles < ActiveRecord::Migration[6.0]
  def change
    add_column :articles, :intro, :text
  end
end
