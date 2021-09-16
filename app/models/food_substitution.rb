class FoodSubstitution < ApplicationRecord
  belongs_to :food
  belongs_to :substitute, class_name: "Food"

  def ratio_with_colon
    r = ratio.to_r
    "#{r.numerator} : #{r.denominator}"
  end

  def ratio_with_colon=(ratio)
    self.ratio = Rational(ratio.gsub(':', '/')).to_f
  end

  def food_name=(name)
    self.food = Food.find_by("LOWER(name) = ?", name.downcase)
  end

  def substitute_name=(name)
    self.substitute = Food.find_by("LOWER(name) = ?", name.downcase)
  end
end
