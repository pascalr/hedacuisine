class RecipeRating < ApplicationRecord
  # FIXME: Should belong to item, not to link.
  belongs_to :link, foreign_key: :recipe_id
  belongs_to :user
end
