class Expression < ApplicationRecord
  validates :default, presence: true, uniqueness: true

  has_one :french_expression
  accepts_nested_attributes_for :french_expression

  def in(language)
    french_expression
  end

  before_save do
    default.downcase!
    #plural.try(:downcase!)
  end
end
