class Food < ApplicationRecord

  has_many :food_recipes
  has_many :producing_recipes, through: :food_recipes, source: :recipe

  has_many :ingredients
  has_many :recipes, through: :ingredients
  
  has_many :descriptions, as: :described

  validates :name, presence: true, uniqueness: true

  has_many :food_tag_items
  has_many :food_tags, through: :food_tag_items

  belongs_to :food_tag, optional: true

  has_many :weighings

  has_many :container_ingredients
  has_many :actual_containers, through: :container_ingredients

  has_many :containers

  before_save do
    name.downcase!
    plural.try(:downcase!)
  end

  alias tag food_tag
  
  def color_string
    return nil if color.nil?
    "##{color.to_s(16)}"
  end

  def color_string=(str)
    self.color = str[1..-1].to_i(16)
  end

  # FIXME: Should probably be unitary_weight instead of unit_weight.

  def is_unitary
    !self.unit_weight.blank?
  end
  alias is_unitary? is_unitary

  #def to_param
  #  "#{id}-#{name}"
  #end
end
