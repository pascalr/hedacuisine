class RecipeFilter < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :image, optional: true

  has_many :filtered_recipes

  def to_obj(params={})
    extract_attributes(params, :name, :image_src, :user_id)
  end
end
