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
  
  def to_param
    return "#{id}" if recipe.name.nil?
    return "#{id}-#{recipe.name.gsub(' ', '-')}"
  end
end
