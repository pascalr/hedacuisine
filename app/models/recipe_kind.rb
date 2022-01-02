class RecipeKind < ApplicationRecord
  belongs_to :image, optional: true
  belongs_to :kind, optional: true
  has_many :recipes

  def to_param
    return "#{id}" if name.nil?
    "#{id}-#{name.downcase.gsub(' ', '_')}"
  end
end
