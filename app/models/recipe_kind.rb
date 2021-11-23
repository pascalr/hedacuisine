class RecipeKind < ApplicationRecord
  belongs_to :image, optional: true
  belongs_to :kind, optional: true
  has_many :recipes
end
