class RecipeIngredient < ApplicationRecord

  acts_as_list column: "item_nb", scope: :recipe

  belongs_to :recipe
  belongs_to :food
  belongs_to :unit, optional: true
  
  delegate :name, to: :food
  delegate :plural, to: :food

  def volume
    quantity_model.ml
  end

  def quantity_model
    # Caching here is premature optimiziation. It could lead to issues. I am not familiar enough with rails to do that.
    #@quantity_model ||= Quantity.new(self.food).set_from_value_and_unit(self.quantity, self.unit)
    Quantity.new(self.food).set_from_value_and_unit(self.quantity, self.unit)
  end
  
  def raw_quantity=(raw_qty)
    q = Quantity.new(self.food).set_from_raw(raw_qty)
    self.quantity = q.unit_quantity
    self.unit = q.unit
    self.weight = q.grams
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
