class Container < ApplicationRecord
  belongs_to :container_format
  belongs_to :machine

  validates :jar_id, uniqueness: true

  has_many :container_ingredients


  def single_content_weight
    ingredients.first.weight
  end

  def single_content_volume
    ingredients.first.volume
  end

  def full_volume
    container_format.volume
  end

  alias ingredients container_ingredients
end
