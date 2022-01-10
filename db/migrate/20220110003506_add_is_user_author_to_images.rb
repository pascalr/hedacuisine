class AddIsUserAuthorToImages < ActiveRecord::Migration[6.1]
  def change
    add_column :images, :is_user_author, :boolean
  end
end
