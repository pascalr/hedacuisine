class IngredientSection < ApplicationRecord
  belongs_to :recipe

  def before_ing_nb
    self[:before_ing_nb].nil? ? 1 : self[:before_ing_nb]
  end
end
