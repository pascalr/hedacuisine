class FavoriteRecipeValidator < ActiveModel::Validator
  def validate(record)
    if record.recipe.user_id == record.user_id
      record.errors.add :base, "A user can't have his own recipe as a favorite"
    end
  end
end

class FavoriteRecipe < ApplicationRecord
  belongs_to :recipe
  belongs_to :user
  validates_with FavoriteRecipeValidator
end
