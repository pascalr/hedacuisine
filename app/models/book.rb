class Book < ApplicationRecord
  belongs_to :user
  has_many :book_recipes
  has_many :recipes, through: :book_recipes

  def name_with_author
    "#{self.name} — #{user.name}"
  end
  
  def author
    "#{user.name}"
  end

end
