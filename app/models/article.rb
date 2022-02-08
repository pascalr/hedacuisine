class Article < ApplicationRecord
  has_many :sections, -> { order(:position) }
  
  scope :all_public, -> { where(is_public: true) }
  scope :all_private, -> { where(is_public: [nil, false]) }
  
  def to_param
    return id if name.nil?
    "#{id}-#{name.gsub(' ', '-')}"
  end

  def content
    raise "deprecated, use json and html"
  end
end
