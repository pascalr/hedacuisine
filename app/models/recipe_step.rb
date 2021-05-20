class RecipeStep < ApplicationRecord
  belongs_to :recipe
  belongs_to :step
end
