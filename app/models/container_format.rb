class ContainerFormat < ApplicationRecord
  has_many :food_preferences
  has_many :container_quantities
end
