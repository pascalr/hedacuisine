class RecipeKind < ApplicationRecord
  belongs_to :image, optional: true
  belongs_to :kind, optional: true
  has_many :recipes
  has_many :suggestions
  has_many :filtered_recipes, as: :filterable

  alias image_assoc image
  def image
    if self.image_assoc.blank?
      self.create_image!
      self.save!
    end
    image_assoc
  end

  def public_recipe_count
    recipes.where(is_public: true).count
  end

  def public_recipe_count_str
    c = public_recipe_count
    "(#{c} #{(c > 1 ? "recettes" : "recette")})"
  end

  def to_param
    return "#{id}" if name.nil?
    "#{id}-#{name.gsub(' ', '-')}"
  end

  def to_obj(params={})
    extract_attributes(params, :name, :description_json)
  end

  def description 
    raise "deprecated, use description_json and description_html"
  end
end
