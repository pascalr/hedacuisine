class AddDescriptionToImages < ActiveRecord::Migration[6.1]
  def change
    add_column :images, :description, :string
  end
end
