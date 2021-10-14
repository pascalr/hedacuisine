class Food < ApplicationRecord

  has_many :recipe_ingredients

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

  has_many :direct_substitutions, foreign_key: "food_id", class_name: "FoodSubstitution"
  has_many :indirect_substitutions, foreign_key: "substitute_id", class_name: "FoodSubstitution"

  def substitutions(previous=nil)
    explicit_substitutions(previous) + implicit_substitutions(previous)
  end

  def explicit_substitutions(previous)
    #direct_substitutions.map {|s| [s, s.substitute] } + indirect_substitutions.map {|s| [s, s.food] }
    subs = direct_substitutions + indirect_substitutions
    subs -= [previous] if previous
    subs
  end

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

  def to_param
    return "#{id}" if name.nil?
    "#{id}-#{name.downcase.gsub(' ', '_')}"
  end

  def implicit_substitutions(previous)
    list = []
    explicit_substitutions(previous).each do |sub|
      through_food = sub.substitute_for(self)
      (through_food.explicit_substitutions(sub)).each do |implicit|
        from = Quantity.new(through_food).set_from_raw(sub.substitute_raw_qty_for(self))
        through = Quantity.new(through_food).set_from_raw(implicit.food_raw_qty_for(through_food))
        to = Quantity.new(implicit.substitute_for(through_food)).set_from_raw(implicit.substitute_raw_qty_for(through_food))
        ratio = Quantity.ratio(from, through)
        s = FoodSubstitution.new
        s.food = self
        s.food_raw_quantity = sub.food_raw_qty_for(self)
        s.substitute = implicit.substitute_for(through_food)
        s.substitute_raw_quantity = (to*ratio).to_raw
        list << s
      end
    end
    list
  end
end
