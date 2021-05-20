class Language < ApplicationRecord
  validates :name, uniqueness: true
  validates :locale, uniqueness: true

  def self.default
    @default ||= Language.find_by(locale: 'fr')
  end
end
