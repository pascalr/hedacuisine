class Tool < ApplicationRecord
  has_many :recipe_tools
  has_many :recipes, through: :recipe_tools
end
