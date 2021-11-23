class RecipeKind < ApplicationRecord
  belongs_to :image, optional: true
end
