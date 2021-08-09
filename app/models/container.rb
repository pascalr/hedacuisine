class Container < ApplicationRecord
  belongs_to :container_format
  belongs_to :machine

  has_many :container_ingredients

  alias ingredients container_ingredients
end
