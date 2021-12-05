class BookRecipe < ApplicationRecord
  belongs_to :recipe
  belongs_to :book
end
