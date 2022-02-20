class BookSection < ApplicationRecord
  belongs_to :book
  #has_one :order, as: :orderable
  
  acts_as_list scope: :book
  
  def before_recipe_at
    self[:before_recipe_at].nil? ? 1 : self[:before_recipe_at]
  end
end
