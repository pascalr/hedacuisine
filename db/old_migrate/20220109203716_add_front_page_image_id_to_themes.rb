class AddFrontPageImageIdToThemes < ActiveRecord::Migration[6.1]
  def change
    add_column :themes, :front_page_image_id, :integer
  end
end
