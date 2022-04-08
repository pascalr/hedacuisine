class AddFilteredToSuggestions < ActiveRecord::Migration[7.0]
  def change
    add_column :suggestions, :filtered, :boolean
  end
end
