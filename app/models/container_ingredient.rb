class ContainerIngredient < ApplicationRecord
  belongs_to :container
  belongs_to :food

  def volume
    weight * food.density
  end
end
