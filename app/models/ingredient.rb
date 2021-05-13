class Ingredient < ApplicationRecord
  belongs_to :recipe
  belongs_to :food

  delegate :name, to: :food
  delegate :plural, to: :food
  delegate :is_unitary?, to: :food
  delegate :is_unitary, to: :food

  def self.weight_of(value, unit, food)
    raise "Missing food (#{food.name}) unit weight." if unit.nil? && food.unit_weight.nil?
    return value * food.unit_weight unless unit
    return value * unit.value if unit.is_weight
    return value * food.density * unit.value if unit.is_volume
    return value * food.unit_weight * unit.value
  end

  def self.build(value, unit, food)
    Ingredient.new(weight: weight_of(value, unit, food), food: food)
  end

  def value_for(unit)
    return self.weight if unit.is_weight
    return self.weight/food.density if unit.is_volume
    return self.weight/food.unit_weight
  end

  def nb_units
    weight / food.unit_weight
  end

  def volume
    self.weight * food.density
  end
end
