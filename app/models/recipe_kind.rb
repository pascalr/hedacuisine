class RecipeKind < ApplicationRecord
  belongs_to :image, optional: true
  belongs_to :kind, optional: true
  has_many :recipes

  def to_param
    return "#{id}" if name.nil?
    "#{id}-#{name.downcase.gsub(' ', '_')}"
  end

  def description 
    raise "deprecated, use description_json and description_html"
  end
end
