class Container < ApplicationRecord
  belongs_to :container_format
  belongs_to :machine

  belongs_to :food, optional: true

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
    return nil if pos_x.nil? or pos_y.nil? or pos_z.nil?
    '(%.2f, %.2f, %.2f)' % [pos_x, pos_y, pos_z]
  end

  def set_from_dict(dict)
    container_ingredients.destroy_all
    dict["ingredients"].each do |ing|
      container_ingredients.create!(food_id: ing["food_id"], weight: ing["weight"])
    end
    self.pos_x = dict["pos_x"]
    self.pos_y = dict["pos_y"]
    self.pos_z = dict["pos_z"]
  end

  alias ingredients container_ingredients
  alias format container_format

  def to_obj(params={})
    extract_attributes(params, :jar_id, :machine_id, :container_format_id, :pos_x, :pos_y, :pos_z, :food_id)
  end
end
