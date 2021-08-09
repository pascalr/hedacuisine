class ContainerIngredient < ApplicationRecord
  belongs_to :container
  belongs_to :food
end
