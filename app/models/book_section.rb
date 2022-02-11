class BookSection < ApplicationRecord
  belongs_to :book
  has_one :order, as: :orderable
  
  def before_recipe_at
    self[:before_recipe_at].nil? ? 1 : self[:before_recipe_at]
  end
end
