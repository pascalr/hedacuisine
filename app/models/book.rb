class Book < ApplicationRecord
  belongs_to :user
  has_many :book_recipes
  has_many :recipes, through: :book_recipes
  belongs_to :theme

  def name_with_author
    "#{self.name} — #{user.name}"
  end
  
  def to_param
    return "#{id}" if name.nil?
    #return "#{id}-#{name.downcase.gsub(' ', '_')}"# if version_name.blank?
    "#{id}-#{name.downcase.gsub(' ', '_')}—#{author.downcase.gsub(' ', '_')}"
  end
  
  def author
    "#{user.name}"
  end

end
