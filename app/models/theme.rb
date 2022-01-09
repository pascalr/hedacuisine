class Theme < ApplicationRecord
  has_many :books

  belongs_to :front_page_image, class_name: "Image"

  def css_class
    self.name.downcase.gsub(/ /, '-')
  end
end
