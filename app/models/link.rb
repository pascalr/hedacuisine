class Link < ApplicationRecord
  has_many :items, foreign_key: 'recipe_id'
  has_many :categories, through: "items"
  has_many :menus, through: "items"
  belongs_to :user
  has_many :ingredients, foreign_key: 'recipe_id'
  has_many :foods, through: :ingredients
  
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
  
  def missing_ingredients_for(user)
    #ingredients.filter {|i| user.food_preferences.in_stock.not.where(food_id: i.food_id).exists? }
    ingredients.select {|i|
      f = user.food_preferences.find_by(food_id: i.food_id)
      f.nil? || !f.in_stock?
    }
  end

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
