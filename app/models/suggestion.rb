class Suggestion < ApplicationRecord
  belongs_to :user
  belongs_to :recipe, optional: true
  belongs_to :recipe_kind, optional: true

  before_save :update_score
  
  scope :all_valid , -> { where(filtered: [nil, false]) }

  # TODO: Validation that either a recipe or a recipe_kind exists, but not both. XOR.

  def update_score
    self.score = (selected_count || 0) * 10 - (skip_count || 0)
  end

  def about
    recipe_id ? recipe : recipe_kind
  end
end
