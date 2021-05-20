class Recipe < ApplicationRecord

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
  has_many :ingredients, foreign_key: 'recipe_id'
  has_many :foods, through: :ingredients
  belongs_to :group, optional: true

  before_save do
    instructions.try :gsub!, /[\u2018\u2019]/, "'"
  end
  
  #has_one_attached :source_image

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

  def fullname
    version_name ? "#{name} (#{version_name})" : name
  end
  
def missing_ingredients
    ingredients.map(&:food).reject(&:in_pantry)
  end

  def last_ingredient_number
    ingredients.blank? ? 0 : ingredients.maximum(:nb)
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
end
