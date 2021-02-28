class Item < ApplicationRecord
  belongs_to :category
  belongs_to :recipe
  belongs_to :menu
end
