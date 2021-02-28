class Category < ApplicationRecord
  belongs_to :menu
  has_many :menu_items
  has_many :recipes, through: "menu_items"

  def fullpath
    "#{menu.name}/#{name}"
  end
end
