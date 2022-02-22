class BookSection < ApplicationRecord
  belongs_to :book
  has_many :book_recipes
  #has_one :order, as: :orderable
  
  acts_as_list scope: :book # from gem acts_as_list
  
  def before_recipe_at
    self[:before_recipe_at].nil? ? 1 : self[:before_recipe_at]
  end
end
