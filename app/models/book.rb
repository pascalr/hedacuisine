class Book < ApplicationRecord
  belongs_to :user
  has_many :book_recipes
  has_many :recipes, through: :book_recipes
  belongs_to :theme
  has_many :book_sections

  has_many :pages
  
  scope :all_public, -> { where(is_public: true) }
  scope :all_featured, -> { where(is_public: true, is_featured: true) }

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

  def items
    (self.book_recipes.to_a + self.book_sections.to_a).sort_by(&:position)
  end

  def next_index_position
    items = book_sections+book_recipes
    position = items.map {|i| i[:position]}.compact.max
    position.nil? ? 1 : position+1
  end

end
