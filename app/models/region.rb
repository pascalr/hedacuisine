class Region < ApplicationRecord
  belongs_to :language
  default_scope {includes(:language)}
end
