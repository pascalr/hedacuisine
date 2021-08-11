class FoodTagItem < ApplicationRecord
  belongs_to :food_tag
  belongs_to :food
end
