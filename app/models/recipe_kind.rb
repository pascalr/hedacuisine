class RecipeKind < ApplicationRecord
  belongs_to :image, optional: true
  belongs_to :kind, optional: true
  has_many :recipes
  has_many :suggestions
  has_many :filtered_recipes, as: :filterable
  has_many :recipe_filters, through: :filtered_recipes
  has_many :match_filtered_recipes, -> {where('filtered_recipes.match' => true)}, as: :filterable, class_name: 'FilteredRecipe'
  has_many :nomatch_filtered_recipes, -> {where('filtered_recipes.match' => [nil, false])}, as: :filterable, class_name: 'FilteredRecipe'
  has_many :matching_filters, through: :match_filtered_recipes, source: :recipe_filter
  has_many :notmatching_filters, through: :nomatch_filtered_recipes, source: :recipe_filter

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
