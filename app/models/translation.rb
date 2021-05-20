# TODO: Validate original is always downcase
class Translation < ApplicationRecord
  belongs_to :from_language, foreign_key: :from, class_name: 'Language'
  belongs_to :to_language, foreign_key: :to, class_name: 'Language'

  # TODO: Cache
  def self.by_original
    Hash[*all.map{ |x| [x.original, x] }.flatten]
  end
  # TODO: Cache
  def self.by_translated
    Hash[*all.map{ |x| [x.translated, x] }.flatten]
  end
end
