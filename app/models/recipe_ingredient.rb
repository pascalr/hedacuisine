class RecipeIngredient < ApplicationRecord

  # unit is deprecated
  # quantity is deprecated
  #
  # weight is good (better would be to rename grams, but who cares)

  acts_as_list column: "item_nb", scope: :recipe

  belongs_to :recipe
  belongs_to :food, optional: true
  
  delegate :plural, to: :food

  def comment
    raise "deprecated, use comment_json and comment_html"
  end

  def name
    self.food ? self.food.name : self.raw_food
  end
  def raw_food=(raw_food)
    super(raw_food)
    self.food = Food.find_by(name: raw_food)
  end

  def volume
    quantity_model.ml
  end

  def refresh_weight
    if self.raw.blank?
      self.weight = nil
    else
      q = Quantity.new(self.food).set_from_raw(self.raw)
      self.weight = q.nil? ? nil : q.grams
    end
  end

  def raw=(str)
    super(str)
    refresh_weight
  end

  def has_quantity
    !raw.blank?
  end
  alias has_quantity? has_quantity

  def quantity
    # Caching here is premature optimiziation. It could lead to issues. I am not familiar enough with rails to do that.
    #@quantity_model ||= Quantity.new(self.food).set_from_value_and_unit(self.quantity, self.unit)
    Quantity.new(self.food).set_from_grams(self.weight)
  end
  alias quantity_model quantity # deprecated
  
  #def raw_quantity=(raw_qty)
  #  q = Quantity.new(self.food).set_from_raw(raw_qty)
  #  self.quantity = q.unit_quantity
  #  self.unit = q.unit
  #  self.weight = q.grams
  #end
  #def raw_quantity
  #  return nil if quantity.nil?
  #  qty_s = sprintf("%g", quantity.round(2))
  #  unit.nil? ? "#{qty_s}" : "#{qty_s} #{unit.name}"
  #end

  def is_unitary?
    return unit && unit.is_unitary?
  end
  
  #delegate :is_unitary?, to: :food
  #delegate :is_unitary, to: :food
  #
  #def nb_units
  #  weight / food.unit_weight
  #end
  
  def to_obj(params={})
    extract_attributes(params, :name, :item_nb, :raw, :comment_json, :food_id, :raw_food)
  end
end
