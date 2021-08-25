class RecipeIngredient < ApplicationRecord
  belongs_to :recipe
  belongs_to :food
  belongs_to :unit, optional: true
  
  delegate :name, to: :food
  delegate :plural, to: :food

  def volume
    return nil if quantity.nil?
    if unit.nil? || (unit && unit.is_unitary)
      return (quantity * food.unit_weight) / food.density
    elsif unit.is_volume
      return quantity
    else
      return quantity / food.density
    end
  end
  
  def self.parse_quantity_and_unit_given_food(raw, food, unit_required=false)
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
    raise "Invalid unit #{unit_s}" if unit.nil? and unit_required
    return qty, unit
  end
 
  def raw_quantity=(raw_qty)
    qty, unit = RecipeIngredient.parse_quantity_and_unit_given_food(raw_qty, self.food)
    self.quantity = qty
    self.unit = unit
  end
  def raw_quantity
    return nil if quantity.nil?
    qty_s = sprintf("%g", quantity.round(2))
    unit.nil? ? "#{qty_s}" : "#{qty_s} #{unit.name}"
  end

  def is_unitary?
    return unit && unit.is_unitary?
  end
  
  #delegate :is_unitary?, to: :food
  #delegate :is_unitary, to: :food
  #
  #def nb_units
  #  weight / food.unit_weight
  #end
end
