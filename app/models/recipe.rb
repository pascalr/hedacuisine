class Recipe < ApplicationRecord

  scope :all_public, -> { where(is_public: true) }
  scope :all_for, lambda { |user|
    return where(is_public: true) unless user
    where(is_public: true).or(Recipe.where(user_id: user.id))
  }

  def similar_recipes
    SimilarRecipe.where(recipe_id: self.id).map(&:similar_recipe) +
      SimilarRecipe.where(similar_recipe_id: self.id).map(&:recipe)
  end

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
  
  #has_one_attached :source_image
  
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
  
  def ingredient_list
    ings = recipe_ingredients.order(weight: :desc).reject {|ing| ing.weight.nil?}.map(&:name).join(", ")
    if ings.length > 80
      ri = ings[0..80].rindex(',')
      return ings[0..ri]
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
    "#{id}-#{name}"
  end

  # DEPRECATED. Version_name is deprecated. Use only name.
  #def fullname
  #  version_name ? "#{name} (#{version_name})" : name
  #end
  def fullname
    name
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
