class Region < ApplicationRecord
  belongs_to :language
  default_scope {includes(:language)}

  validates :name, presence: true, uniqueness: true
  validates :locale, presence: true, uniqueness: true
  validates :code, presence: true, uniqueness: true

  def locale_with_underscore
    l = locale
    l[2] = "_" if l[2] == "-"
    l
  end
end
