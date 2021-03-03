class Recipe < ApplicationRecord
  has_many :ingredients
  has_many :foods, through: :ingredients

  def to_param
    "#{id}-#{name}"
  end
end
