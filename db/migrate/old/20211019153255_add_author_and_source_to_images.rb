class AddAuthorAndSourceToImages < ActiveRecord::Migration[6.1]
  def change
    add_column :images, :author, :string
    add_column :images, :source, :string
  end
end
