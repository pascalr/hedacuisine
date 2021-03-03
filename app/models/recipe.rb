class Recipe < ApplicationRecord
  def to_param
    "#{id}-#{name}"
  end
end
