class AddListingIdToMenus < ActiveRecord::Migration[6.0]
  def change
    add_column :menus, :listing_id, :integer
  end
end
