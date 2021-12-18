class BookRecipe < ApplicationRecord
  belongs_to :recipe
  belongs_to :book
  has_one :order, as: :orderable
end
