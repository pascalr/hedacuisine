class RecipeNote < ApplicationRecord
  belongs_to :recipe

  acts_as_list column: "item_nb", scope: :recipe
end
