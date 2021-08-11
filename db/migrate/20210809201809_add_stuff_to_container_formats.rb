class AddStuffToContainerFormats < ActiveRecord::Migration[6.0]
  def change
    add_column :container_formats, :diameter, :float
    add_column :container_formats, :height_with_lid, :float
    add_column :container_formats, :lid_height, :float
    add_column :container_formats, :max_content_height, :float
    add_column :container_formats, :body_weight, :float
    add_column :container_formats, :lid_weight, :float
    add_column :container_formats, :volume, :float
  end
end
