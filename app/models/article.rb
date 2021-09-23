class Article < ApplicationRecord
  has_many :sections
  
  scope :all_public, -> { where(is_public: true) }
  scope :all_private, -> { where(is_public: [nil, false]) }
  
  def to_param
    return id if name.nil?
    "#{id}-#{name.gsub(' ', '_')}"
  end
end
