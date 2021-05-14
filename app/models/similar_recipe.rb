class SimilarRecipe < ApplicationRecord
  belongs_to :recipe
  belongs_to :similar_recipe, class_name: 'Recipe'
end
