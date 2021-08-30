class Meal < ApplicationRecord
  belongs_to :machine
  belongs_to :recipe
end
