class FoodSubstitution < ApplicationRecord
  belongs_to :food
  belongs_to :substitute, class_name: "Food"
  
  def food_raw_qty_for(f)
    f == food ? food_raw_quantity : substitute_raw_quantity 
  end

  def substitute_raw_qty_for(f)
    f == food ? substitute_raw_quantity : food_raw_quantity
  end

  def substitute_for(f)
    f == food ? substitute : food
  end

  def ratio_for(f)
    f == food ? 1.0/ratio : ratio
  end

  def other_food(f)
    f == food ? substitute : food
  end

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
