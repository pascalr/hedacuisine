class Theme < ApplicationRecord
  has_many :books

  def css_class
    self.name.downcase.gsub(/ /, '-')
  end
end
