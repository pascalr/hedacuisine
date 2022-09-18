class CreateImages < ActiveRecord::Migration[6.0]
  def change
    create_table :images, if_not_exists: true do |t|
      t.string :filename
      t.float :zoom
      t.float :left
      t.float :top

      t.timestamps
    end
  end
end
