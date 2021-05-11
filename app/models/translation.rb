class Translation < ApplicationRecord
  belongs_to :from_language, foreign_key: :from, class_name: 'Language'
  belongs_to :to_language, foreign_key: :to, class_name: 'Language'
end
