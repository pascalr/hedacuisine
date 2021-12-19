class BookRecipe < ApplicationRecord
  belongs_to :recipe
  belongs_to :book
  has_one :order, as: :orderable

  def position
    if self[:position]
      self[:position]
    else
      update!(position: book.next_index_position)
    end
  end
end
