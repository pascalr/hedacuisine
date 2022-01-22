class UserRecipeCategory < ApplicationRecord
  belongs_to :user

  has_many :user_recipes
end
