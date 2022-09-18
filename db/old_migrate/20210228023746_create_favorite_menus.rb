class CreateFavoriteMenus < ActiveRecord::Migration[6.0]
  def change
    create_table :favorite_menus do |t|
      t.references :menu, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
