class BookRecipe < ApplicationRecord
  belongs_to :recipe
  belongs_to :book
  belongs_to :book_section, optional: true
  #has_one :order, as: :orderable

  acts_as_list scope: [:book_id, :book_section_id] # from gem acts_as_list
  #acts_as_list column: "position", scope: :book

  def to_param
    return "#{id}" if recipe.name.nil?
    return "#{id}-#{recipe.name.gsub(' ', '-')}"
  end
end
