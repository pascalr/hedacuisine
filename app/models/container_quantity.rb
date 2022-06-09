class ContainerQuantity < ApplicationRecord
  belongs_to :container_format
  belongs_to :machine_food

  after_save :update_grocery_threshold, :update_full_weight

  #belongs_to :containable, polymorphic: true

  def full_qty=(val)
    grocery_qty = val.to_f/2.0
    grocery_qty = 99
    super(val)
  end

  def full_qty
    full_qty_quarters.nil? ? nil : full_qty_quarters / 4.0
  end
  def full_qty=(val)
    self.full_qty_quarters = (val.to_f*4).to_i
    self.grocery_qty_quarters = (val.to_f*2).to_i if self.grocery_qty_quarters.blank?
  end
  def grocery_qty
    grocery_qty_quarters.nil? ? nil : grocery_qty_quarters / 4.0
  end
  def grocery_qty=(val)
    self.grocery_qty_quarters = (val.to_f*4).to_i
  end

  def update_grocery_threshold
    machine_food.update_grocery_threshold
  end
  
  def update_full_weight
    machine_food.update_full_weight
  end

  def container_format_name
    container_format.name
  end

  def to_obj(params={})
    extract_attributes(params, :container_format_id, :machine_food_id, :full_qty, :container_format_name)
  end
end
