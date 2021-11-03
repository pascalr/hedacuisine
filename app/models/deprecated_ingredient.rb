class DeprecatedIngredient < ApplicationRecord
  belongs_to :recipe
  belongs_to :food

  delegate :name, to: :food
  delegate :plural, to: :food
  delegate :is_unitary?, to: :food
  delegate :is_unitary, to: :food

  validates_presence_of :nb

  def self.parse_quantity_and_unit_given_food(raw, food)
    qty = nil
    #qty_s = raw.match(/^\d+([,.\/]\d+)?/)
    qty_s = raw[/^\d+([,.\/]\d+)?/]
    raise "Invalid quantity #{qty_s}" if qty_s.blank?
    #qty_s = raw[/^\d+[,./]\d+/]
    if qty_s.include?("/")
      qty = qty_s.to_r.to_f
    else
      qty = qty_s.to_f
    end
    unit_s = raw[qty_s.length..-1].strip
    unit = Unit.find_by(name: unit_s)
    raise "Invalid unit #{unit_s}" unless unit
    self.build(qty, unit, food)
  end

  def self.food_grams(food, grams)
    i = Ingredient.new
    i.food = food
    i.weight = grams
    return i
  end

  def self.weight_of(value, unit, food)
    raise "Missing food (#{food.name}) unit weight." if unit.nil? && food.unit_weight.nil?
    return value * food.unit_weight unless unit
    return value * unit.value if unit.is_weight
    return value * food.density * unit.value if unit.is_volume
    return value * food.unit_weight * unit.value
  end

  def self.build(value, unit, food, container_nb=nil)
    Ingredient.new(weight: value.blank? ? nil : weight_of(value, unit, food), food: food, container_nb: container_nb)
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
    return nil if self.weight.blank?
    self.weight * food.density
  end
end
