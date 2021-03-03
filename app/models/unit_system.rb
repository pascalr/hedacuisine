class UnitSystem < ApplicationRecord
  has_many :unit_system_items
  has_many :units, through: :unit_system_items
end
