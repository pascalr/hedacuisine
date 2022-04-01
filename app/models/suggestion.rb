class Suggestion < ApplicationRecord
  belongs_to :user
  belongs_to :recipe, optional: true
  belongs_to :recipe_kind, optional: true

  def about
    recipe_id ? recipe : recipe_kind
  end
end
