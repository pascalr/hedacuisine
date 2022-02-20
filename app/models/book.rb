class Book < ApplicationRecord
  belongs_to :user
  has_many :book_recipes
  has_many :recipes, through: :book_recipes
  belongs_to :theme, optional: true # deprecated actually
  has_many :book_sections
  alias sections book_sections

  has_many :pages
  
  scope :all_public, -> { where(is_public: true) }
  scope :all_featured, -> { where(is_public: true, is_featured: true) }

  belongs_to :book_format, optional: true # FIXME: Temporarily optional for db migration
  belongs_to :front_page_image, class_name: "Image", optional: true

  def name_with_author
    "#{self.name} — #{user.name}"
  end

  def to_param
    return "#{id}" if name.nil?
    #return "#{id}-#{name.downcase.gsub(' ', '_')}"# if version_name.blank?
    p = "#{id}-#{name.gsub(' ', '-')}"
    #p += "-de-#{author.gsub(' ', '-')}" unless author.blank?
    p
  end
  
  def author
    "#{user.name}"
  end

  def page_aspect_ratio
    if book_format
      book_format.page_aspect_ratio
    else
      front_page_image ? front_page_image.aspect_ratio : 480.0 / 640.0
    end
  end

end
