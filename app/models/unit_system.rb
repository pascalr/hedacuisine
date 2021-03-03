class UnitSystem < ApplicationRecord
  has_many :unit_system_items
  has_many :units, through: :unit_system_items

  def self.default
    @default ||= UnitSystem.first # TODO: Use order
  end
end
