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

  def pretty_position
    '(%.2f, %.2f, %.2f)' % [pos_x, pos_y, pos_z]
  end

  alias ingredients container_ingredients
end
