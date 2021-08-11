class FoodTag < ApplicationRecord
  has_many :food_tag_items
  has_many :foods, through: :food_tag_items
end
