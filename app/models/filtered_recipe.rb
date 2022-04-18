class FilteredRecipe < ApplicationRecord
  belongs_to :recipe_filter
  belongs_to :filterable, polymorphic: true

  validates :recipe_filter_id, uniqueness: { scope: [:filterable_id, :filterable_type],
    message: "should only be one filtered recipe by item" }

end
