class FavoriteRecipe < ApplicationRecord
  belongs_to :recipe
  belongs_to :user
  validates :recipe_id, uniqueness: {scope: :user_id}

  def name
    self.recipe.name
  end

  def to_obj(params={})
    extract_attributes(params, :name, :list_id, :recipe_id)
  end
end
