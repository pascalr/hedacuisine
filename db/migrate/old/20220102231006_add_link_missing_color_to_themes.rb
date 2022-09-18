class AddLinkMissingColorToThemes < ActiveRecord::Migration[6.1]
  def change
    add_column :themes, :link_missing, :integer
  end
end
