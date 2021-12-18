class BookSection < ApplicationRecord
  belongs_to :book
  has_one :order, as: :orderable
end
