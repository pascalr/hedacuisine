class ContainerQuantity < ApplicationRecord
  belongs_to :container_format
  belongs_to :machine_food

  #belongs_to :containable, polymorphic: true

  def full_qty_quarters
    full_qty.nil? ? nil : full_qty * 4
  end
  def full_qty_quarters=(val)
    full_qty = val/4.0
  end
  def grocery_qty_quarters
    full_qty.nil? ? nil : full_qty * 4
  end
  def grocery_qty_quarters=(val)
    full_qty = val/4.0
  end
end
