class Food < ApplicationRecord

  has_many :ingredients
  has_many :recipes, through: :ingredients

  def weight_for(value, unit)
    return value if unit.is_weight
    return value/self.density if unit.is_volume
    return value * self.unit_weight
  end
  
  def color_string
    return nil if color.nil?
    "##{color.to_s(16)}"
  end

  def color_string=(str)
    self.color = str[1..-1].to_i(16)
  end

  def is_unitary
    !self.is_volume and !self.is_weight
  end
  alias is_unitary? is_unitary

  #def to_param
  #  "#{id}-#{name}"
  #end
end
