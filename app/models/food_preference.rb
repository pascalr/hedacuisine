# Could also have been called UserIngredient. But FoodPreference is fine. It refers to
# a Food, and a preference means it refers to a User.
class FoodPreference < ApplicationRecord
  belongs_to :food
  belongs_to :user

  validates :food_id, uniqueness: {scope: :user_id}

  # It will be really advanced what you can do with avaiability.
  # TODO: Also add: :made_from_recipe
  # TODO: Also add: :alias
  # I am not sure yet how to handle all this.
  # What I wanted is a way to know how many ingredients are missing per recipe.
  enum availability: [ :in_stock, :available, :unavailable ]
  enum preference: [ :loved, :liked, :disliked, :intolerant, :allergic, :strongly_allergic ]
end
