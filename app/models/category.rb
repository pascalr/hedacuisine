class Category < ApplicationRecord
  belongs_to :menu
  has_many :items
  has_many :recipes, through: "items"

  def fullpath
    "#{menu.name}/#{name}"
  end
end
