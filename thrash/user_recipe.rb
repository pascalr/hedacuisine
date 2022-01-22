class UserRecipe < ApplicationRecord
  belongs_to :user
  belongs_to :recipe
  belongs_to :user_recipe_category, optional: true
end
