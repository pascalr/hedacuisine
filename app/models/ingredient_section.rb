class IngredientSection < ApplicationRecord
  belongs_to :recipe

  def before_ing_nb
    self[:before_ing_nb].nil? ? 1 : self[:before_ing_nb]
  end

  def to_obj(params={})
    extract_attributes(params, :before_ing_nb, :name)
  end
end
