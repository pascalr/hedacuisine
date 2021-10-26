class Expression < ApplicationRecord
  validates :default, presence: true, uniqueness: true

  has_one :french_expression
  accepts_nested_attributes_for :french_expression

  has_one :english_expression
  accepts_nested_attributes_for :english_expression

  def in(language)
    case language.name
    when "Français" then french_expression
    when "English" then english_expression
    else
      raise "Error getting specific expression. Unkown language: #{language.name}"
    end
  end

  before_save do
    default.downcase!
    #plural.try(:downcase!)
  end

  after_save do
    if saved_change_to_attribute?(:default)
      if self.french_expression.nil?
        self.create_french_expression(singular: default)
      else
        self.french_expression.update(singular: default)
      end
    end
  end
end
