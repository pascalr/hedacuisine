class AddIsPublicToFoods < ActiveRecord::Migration[6.1]
  def change
    add_column :foods, :is_public, :boolean
  end
end
