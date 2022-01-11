class Theme < ApplicationRecord
  has_many :books

  belongs_to :book_format, optional: true # FIXME: Temporarily optional for db migration
  belongs_to :front_page_image, class_name: "Image", optional: true

  def css_class
    self.name.downcase.gsub(/ /, '-')
  end
end
