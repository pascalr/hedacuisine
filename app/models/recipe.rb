class Recipe < ApplicationRecord

  scope :all_main, -> { where(base_recipe_id: nil) }
  scope :with_images, -> { where.not(image_id: nil) }

  scope :all_public, -> { where(is_public: true) }
  scope :all_for, lambda { |user|
    return where(is_public: true) unless user
    where(is_public: true).or(Recipe.where(user_id: user.id))
  }

  def similar_recipes
    SimilarRecipe.where(recipe_id: self.id).map(&:similar_recipe) +
      SimilarRecipe.where(similar_recipe_id: self.id).map(&:recipe)
  end

  belongs_to :image, optional: true

  belongs_to :main_ingredient, optional: true, class_name: "RecipeIngredient"

  belongs_to :base_recipe, class_name: "Recipe", optional: true
  has_many :variants, class_name: "Recipe", foreign_key: "base_recipe_id"

  has_many :recipe_steps
  has_many :steps, through: :recipe_steps

  has_many :food_recipes
  has_many :produced_foods, through: :food_recipes, source: :food

  has_many :items, foreign_key: 'recipe_id'
  has_many :categories, through: "items"
  has_many :menus, through: "items"
  belongs_to :user
  #has_many :ingredients, foreign_key: 'recipe_id'
  has_many :foods, through: :ingredients
  belongs_to :group, optional: true

  has_many :user_recipes

  has_many :recipe_ingredients#, foreign_key: 'recipe_id'

  before_save do
    instructions.try :gsub!, /[\u2018\u2019]/, "'"
  end
  
  def _all_variants(vars = nil)
    vars ||= []
    if base_recipe && !vars.include?(base_recipe)
      vars << base_recipe 
      vars = base_recipe._all_variants(vars)
    end
    (variants || []).each do |var|
      unless vars.include?(var)
        vars << var
        vars = var._all_variants(vars)
      end
    end
    vars 
  end

  def all_variants(vars = nil)
    vars = _all_variants
    vars.delete(self)
    vars 
  end
  alias alternatives all_variants

  def alternative_ingredients
    ings = alternatives.map(&:ingredients).flatten(1)
    food_ids = ingredients.map(&:food_id)
    ings.reject {|ing| 
      reject = food_ids.include?(ing.food_id)
      food_ids << ing.food_id unless reject # remove duplicates
      reject
    }
  end
  
  #has_one_attached :source_image
  
  #def description=(raw_value)
  #  value = raw_value.gsub("<br>", "\n")
  #  super(value)
  #end
  
  def name
    # FIXME: Make sure base_recipe cannot be self.
    base_recipe ? base_recipe.name : self[:name]
  end
  def description
    base_recipe ? base_recipe.description : self[:description]
    #desc = base_recipe ? base_recipe.description : self[:description]
    #desc.gsub("\n", "<br>")
  end
  def image_id
    base_recipe ? base_recipe.image_id : self[:image_id]
  end
  alias_method :original_image, :image
  def image
    base_recipe ? base_recipe.image : self.original_image
  end
  
  def self.parse_quantity_and_servings_name(raw)
    qty = nil
    #qty_s = raw.match(/^\d+([,.\/]\d+)?/)
    qty_s = raw[/^\d+([,.\/]\d+)?/]
    return nil, nil if qty_s.blank?
    #qty_s = raw[/^\d+[,./]\d+/]
    if qty_s.include?("/")
      qty = qty_s.to_r.to_f
    else
      qty = qty_s.to_f
    end
    name = raw[qty_s.length..-1].strip
    return qty, name
  end
  
  def raw_servings=(raw_servings)
    qty, name = Recipe.parse_quantity_and_servings_name(raw_servings)
    self.servings_quantity = qty
    self.servings_name = name
  end
  def raw_servings
    return nil if servings_quantity.nil?
    qty_s = sprintf("%g", servings_quantity.round(2))
    servings_name.nil? ? "#{qty_s}" : "#{qty_s} #{servings_name}"
  end
  def servings
    return nil if servings_quantity.nil?
    qty_s = sprintf("%g", servings_quantity.round(2))
    # FIXME: translation
    servings_name.blank? ? "#{qty_s} portions" : "#{qty_s} #{servings_name}"
  end
  
  def ingredients_ordered_by_weight
    recipe_ingredients.order(RecipeIngredient.arel_table[:weight].desc.nulls_last)
  end

  def ingredient_list
    ings = ingredients_ordered_by_weight.map(&:name).join(", ")
    if ings.length > 80
      ri = ings[0..80].rindex(',')
      return ings[0..80] if ri.blank?
      return ings[0..ri] + " ..."
    end
    ings
  end

  def user_rating(user)
    return nil unless user
    user.recipe_ratings.find_by(recipe_id: self.id)
  end

  def user_comment(user)
    return nil unless user
    user.recipe_comments.find_by(recipe_id: self.id)
  end

  def average_rating
    RecipeRating.where(recipe_id: self.id).average(:rating)
  end

  def number_of_ratings
    RecipeRating.where(recipe_id: self.id).count
  end

  def to_param
    return "#{id}" if name.nil?
    return "#{id}-#{name.downcase.gsub(' ', '_')}"# if version_name.blank?
    #"#{id}-#{name.downcase.gsub(' ', '_')}_#{version_name.downcase.gsub(' ', '_')}"
  end

  def pretty_version_name
    return version_name unless version_name.blank?
    return version_nb.to_s if version_nb
    return "version 1"
  end
  def pretty_version
    "#{pretty_version_name} ⭐⭐⭐⭐⭐ (1)"
  end

  def fullname
    version_name.blank? ? name : "#{name} (#{pretty_version})"
  end
  
  def missing_ingredients
    recipe_ingredients.map(&:food).reject(&:in_pantry)
  end

  def user_recipe_for(user)
    return nil if user.nil?
    user_recipes.where(user_id: user.id).first
  end
  
  #def missing_ingredients_for(user)
  #  #ingredients.filter {|i| user.food_preferences.in_stock.not.where(food_id: i.food_id).exists? }
  #  #ingredients.select {|i|
  #  #  f = user.food_preferences.find_by(food_id: i.food_id)
  #  #  f.nil? || !f.in_stock?
  #  #}
  #end

  #def get_image_width
  #  if picture.attached? and image_width.blank?
  #    data = ActiveStorage::Analyzer::ImageAnalyzer.new(picture).metadata
  #    self.image_width = data[:width].to_f * (200.0 / data[:height]) # FIXME: HARDCODED 200
  #    save!
  #  end
  #  self.image_width
  #  #if picture.attached?
  #  #  picture.analyze
  #  #  logger.info "Methods: " + (picture.record.methods - Object.methods).to_s
  #  #  if picture.analyzed?
  #  #    return picture.dimension.width
  #  #  end
  #  #end
  #  #return 200
  #end
  
  alias ingredients recipe_ingredients
end
