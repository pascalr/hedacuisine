class BookRecipe < ApplicationRecord
  belongs_to :recipe
  belongs_to :book
  has_one :order, as: :orderable

  acts_as_list scope: :book
  #acts_as_list column: "position", scope: :book

  def to_param
    return "#{id}" if recipe.name.nil?
    return "#{id}-#{recipe.name.gsub(' ', '-')}"
  end
end
