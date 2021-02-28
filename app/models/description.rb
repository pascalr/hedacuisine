class Description < ApplicationRecord
  belongs_to :language
  belongs_to :described, polymorphic: true
end
