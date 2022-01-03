class AddIsPublicToBooks < ActiveRecord::Migration[6.1]
  def change
    add_column :books, :is_public, :boolean
    add_column :books, :is_featured, :boolean
  end
end
