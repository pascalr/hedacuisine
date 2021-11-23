class Kind < ApplicationRecord
  #has_many :recipes
  has_many :recipe_kinds

  belongs_to :kind, optional: true
  has_many :kinds

  def ancestors # including itself
    kind ? kind.ancestors + [self] : [self]
  end

  def descendants # excluding itself
    return [] if kinds.blank?
    kinds + kinds.map(&:descendants).flatten(1)
  end

  def all_recipes_count
    recipes.count + descendants.map(&:all_recipes_count).sum
  end

  def to_param
    return "#{id}" if name.nil?
    "#{id}-#{name.downcase.gsub(' ', '_')}"
  end
end
