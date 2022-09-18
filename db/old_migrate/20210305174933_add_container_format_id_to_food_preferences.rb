class AddContainerFormatIdToFoodPreferences < ActiveRecord::Migration[6.0]
  def change
    add_column :food_preferences, :container_format_id, :integer
  end
end
