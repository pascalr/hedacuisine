class RecipeFilter < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :image, optional: true

  def to_obj(params={})
    extract_attributes(params, :name)
  end
end
