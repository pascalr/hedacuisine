class BookRecipe < ApplicationRecord
  belongs_to :recipe
  belongs_to :book
  belongs_to :book_section, optional: true
  #has_one :order, as: :orderable

  default_scope { includes(:recipe).order('position ASC') }

  acts_as_list scope: [:book_id, :book_section_id] # from gem acts_as_list
  #acts_as_list column: "position", scope: :book

  def to_param
    return "#{id}" if recipe.name.nil?
    return "#{id}-#{recipe.name.gsub(' ', '-')}"
  end

  def to_obj(params={})
    extract_attributes(params, :position, :book_section_id)
  end
end
