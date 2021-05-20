class MissingTranslation < ApplicationRecord
  validates_uniqueness_of :content
end
