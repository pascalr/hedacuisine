class Language < ApplicationRecord
  validates :name, uniqueness: true
  validates :locale, uniqueness: true
end
