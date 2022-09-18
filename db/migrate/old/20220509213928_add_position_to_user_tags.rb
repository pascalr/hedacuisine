class AddPositionToUserTags < ActiveRecord::Migration[7.0]
  def change
    add_column :user_tags, :position, :integer
  end
end
