class Suggestion < ApplicationRecord
  belongs_to :user
  belongs_to :recipe, optional: true
  belongs_to :recipe_kind, optional: true

  delegate :name, to: :recipe
  delegate :image_id, to: :recipe

  before_save :update_score
  
  scope :all_valid , -> { where(filtered: [nil, false]) }

  # TODO: Validation that either a recipe or a recipe_kind exists, but not both. XOR.

  def update_score
    self.score = (selected_count || 0) * 10 - (skip_count || 0)
  end

  def filter
    raise "deprecated, use FilteredRecipe instead"
  end

  def about_id
    recipe_id ? recipe_id : recipe_kind_id
  end
  def about
    recipe_id ? recipe : recipe_kind
  end

  def to_obj(params={})
    extract_attributes(params, :user_id, :recipe_id, :filter_id, :score)
  end
  
  def to_obj_with_recipe_info(params={})
    extract_attributes(params, :user_id, :recipe_id, :filter_id, :score, :name, :image_id)
  end
end
