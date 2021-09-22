class Article < ApplicationRecord
  has_many :sections
  
  def to_param
    return id if name.nil?
    "#{id}-#{name.gsub(' ', '_')}"
  end
end
