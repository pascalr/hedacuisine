class Ingredient < ApplicationRecord
  belongs_to :recipe
  belongs_to :food

  delegate :name, to: :food

  def volume
    self.weight * food.density
  end
end
