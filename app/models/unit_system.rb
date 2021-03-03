class UnitSystem < ApplicationRecord
  has_many :unit_system_items
  has_many :units, through: :unit_system_items

  # FIXME: Oversimplified. TODO: Allow multiple units: 1 lb and 4 ounces...
  def weight_unit
    @weight_unit ||= units.where(is_weight: true).first
  end

  # FIXME: Oversimplified. TODO: Allow multiple units: 1 lb and 4 ounces...
  def volume_unit
    @volume_unit ||= units.where(is_volume: true).first
  end
  
  # FIXME: Oversimplified. TODO: Allow multiple units: 1 lb and 4 ounces...
  def unitary_unit
    @unitary_unit ||= units.where(is_volume: false, is_weight: false).first
  end

  def unit_for(ingredient)
    return unitary_unit if ingredient.is_unitary and unitary_unit
    return volume_unit if ingredient.is_liquid and volume_unit
    weight_unit
  end

  def self.default
    @default ||= UnitSystem.first # TODO: Use order
  end
end
