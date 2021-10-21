class Kind < ApplicationRecord
  has_many :recipes

  def to_param
    return "#{id}" if name.nil?
    "#{id}-#{name.downcase.gsub(' ', '_')}"
  end
end
