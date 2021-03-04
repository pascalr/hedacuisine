class Recipe < ApplicationRecord
  has_many :ingredients
  has_many :foods, through: :ingredients
  belongs_to :user

  def to_param
    "#{id}-#{name}"
  end
end
