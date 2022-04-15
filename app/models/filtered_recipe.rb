class FilteredRecipe < ApplicationRecord
  belongs_to :recipe_filter
  belongs_to :filterable, polymorphic: true
end
