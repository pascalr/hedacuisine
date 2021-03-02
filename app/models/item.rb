class Item < ApplicationRecord
  belongs_to :category
  belongs_to :link, foreign_key: :recipe_id
  belongs_to :menu
end
