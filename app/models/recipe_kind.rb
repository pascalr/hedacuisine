class RecipeKind < ApplicationRecord
  belongs_to :image, optional: true
  belongs_to :kind, optional: true
  has_many :recipes

  alias image_assoc image
  def image
    self.create_image!() if self.image_assoc.blank?
    self.image_assoc
  end

  def to_param
    return "#{id}" if name.nil?
    "#{id}-#{name.downcase.gsub(' ', '_')}"
  end

  def description 
    raise "deprecated, use description_json and description_html"
  end
end
