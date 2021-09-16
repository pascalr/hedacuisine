class FoodSubstitution < ApplicationRecord
  belongs_to :food
  belongs_to :substitute, class_name: "Food"
end
