class RecipeTool < ApplicationRecord
  belongs_to :recipe
  belongs_to :tool
end
