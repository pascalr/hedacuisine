class RecipeValidator < ActiveModel::Validator
  def validate(record)
    if record.base_recipe_id && record.base_recipe_id == record.id
      record.errors.add :base, "A recipe cannot be based on itself."
    end
  end
end

class Recipe < ApplicationRecord

  validates_with RecipeValidator

  before_update :update_mods_unpublished, :if => :text_changed?
  #before_update :update_mods_unpublished, :if => proc { !logo_ori_was && logo_ori_changed? }

  scope :all_main, -> { where(base_recipe_id: nil) }
  scope :with_images, -> { where.not(image_id: nil) }
  scope :with_recipe_kind, -> { where.not(recipe_kind_id: nil) }

  scope :all_public, -> { where(is_public: true) }
  scope :all_for, -> (user) {
    user ? where(user_id: user.id) : all
  }

  def similar_recipes
    SimilarRecipe.where(recipe_id: self.id).map(&:similar_recipe) +
      SimilarRecipe.where(similar_recipe_id: self.id).map(&:recipe)
  end

  has_rich_text :rich_text

  has_one :mix

  belongs_to :recipe_image, optional: true, class_name: "Image", foreign_key: "image_id"

  belongs_to :recipe_kind, optional: true

  has_many :references
  has_many :favorite_recipes
  has_many :filtered_recipes, as: :filterable

  belongs_to :kind, optional: true
  has_many :recipe_tools
  has_many :tools, through: :recipe_tools

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

  has_many :recipe_ingredients, dependent: :delete_all#, foreign_key: 'recipe_id'
  has_many :recipe_notes, dependent: :delete_all#, foreign_key: 'recipe_id'
  has_many :ingredient_sections, dependent: :delete_all#, foreign_key: 'recipe_id'
  has_many :suggestions
  has_many :tags, through: :suggestions

  has_many :book_recipes

  def book
    book_recipe = book_recipes.left_outer_joins(:book).where(book: {user_id: self.user_id}).first
    book_recipe ? book_recipe.book : nil
  end

  def text
    raise "deprecated, use json and html"
  end

  before_save do
    instructions.try :gsub!, /[\u2018\u2019]/, "'"
    if base_recipe.nil?
      self.version_nb = 1
    elsif version_nb.nil?
      self.version_nb = base_recipe.alternatives.size + 2
    end
    true
  end

  #def versions
  #  [self] + other_versions
  #end
  #def other_versions
  #  @other_versions ||= (Recipe.where("LOWER(name) = ?", name.downcase).to_a - [self])
  #end
  
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
    # FIXME: This is shit. Simply copy the name when basing on another recipe, and always use name...
    return self[:name] if self[:name]
    return base_recipe.name if base_recipe
    nil
  end
  def description
    base_recipe ? base_recipe.description : self[:description]
    #desc = base_recipe ? base_recipe.description : self[:description]
    #desc.gsub("\n", "<br>")
  end
  def image_used_id
    #base_recipe ? base_recipe.image_id : self[:image_id]
    use_personalised_image ? self.image_id : (self.recipe_kind ? self.recipe_kind.image_id : nil)
  end
  def image_used
    use_personalised_image ? self.recipe_image : (self.recipe_kind ? self.recipe_kind.image : nil)
    #self.recipe_image || (self.recipe_kind ? self.recipe_kind.image : nil)
    #base_recipe ? base_recipe.image : self.recipe_image
    #base_recipe ? base_recipe.image : self.recipe_image
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
    #recipe_ingredients.order(RecipeIngredient.arel_table[:weight].desc.nulls_last)
    # NULLS_LAST is only supported in SQLite 3.30 and I have 3.11 installed.
    recipe_ingredients.sort_by {|i| i.weight.nil? ? -1 : i.weight}.reverse
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
    return "#{id}-#{name.gsub(' ', '-')}"# if version_name.blank?
    #"#{id}-#{name.downcase.gsub(' ', '_')}_#{version_name.downcase.gsub(' ', '_')}"
  end

  def pretty_version_name
    return "version #{version_nb}"
    return version_name unless version_name.blank?
    return version_nb.to_s if version_nb
    return "version 1"
  end
  def pretty_version
    "#{pretty_version_name} ☆☆☆☆☆ (0)"
    #"#{pretty_version_name} ⭐⭐⭐⭐⭐ (1)"
  end

  def fullname
    version_name.blank? ? name : "#{name} (#{pretty_version})"
  end
  
  def missing_ingredients
    recipe_ingredients.map(&:food).reject(&:in_pantry)
  end

  def warnings
    list = []
    list << "Main ingredient should be set." if !ingredients.blank? and main_ingredient.blank?
    list << "Servings field is empty." if servings.blank?
    list
    # TODO: Add warnings when ingredients are not in the ingredient text.
  end

  def use_personalised_image=(value)
    super(value)
    if self.use_personalised_image && !self.recipe_image
      self.recipe_image = Image.new
      self.recipe_image.save!
    end
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

  def is_user_favorite(user)
    self.favorite_recipes.where(user_id: user.id).exists?
  end

  def user_favorite(user)
    self.favorite_recipes.where(user_id: user.id).first
  end
  
  alias ingredients recipe_ingredients
  alias notes recipe_notes

  def match_category
    #words = self.name.split(' ').reject {|w| w.length <= 2}.map {|w| I18n.transliterate(w.downcase) }
    words = self.name.split(' ').reject {|w| w.length <= 2}.map {|w| w.downcase }
    categories = RecipeKind.where("LOWER(name) like ?", "%#{words.join('%')}%")
    return categories.first if categories.size == 1
    nil
  end

  def to_obj(params={})
    extract_attributes(params, :name, :recipe_kind_id, :main_ingredient_id, :preparation_time, :cooking_time, :total_time, :raw_servings, :json, :use_personalised_image, :image_id)
  end

private

  def update_mods_unpublished
    self.mods_unpublished = true
  end

end
