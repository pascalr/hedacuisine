class AddEmojiToMenus < ActiveRecord::Migration[6.0]
  def change
    add_column :menus, :emoji, :string
  end
end
