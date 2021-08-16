class AddIconToContainerFormats < ActiveRecord::Migration[6.0]
  def change
    add_column :container_formats, :icon, :string
  end
end
