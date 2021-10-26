class Region < ApplicationRecord
  belongs_to :language
  default_scope {includes(:language)}

  validates :name, presence: true, uniqueness: true
  validates :locale, presence: true, uniqueness: true
  validates :code, presence: true, uniqueness: true
end
