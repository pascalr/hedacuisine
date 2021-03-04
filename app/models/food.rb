class Food < ApplicationRecord

  has_many :ingredients
  has_many :recipes, through: :ingredients

  validates :name, presence: true, uniqueness: true

  before_save do
    name.downcase!
    plural.try(:downcase!)
  end
  
  def color_string
    return nil if color.nil?
    "##{color.to_s(16)}"
  end

  def color_string=(str)
    self.color = str[1..-1].to_i(16)
  end

  # FIXME: Should probably be unitary_weight instead of unit_weight.

  def is_unitary
    !self.unit_weight.blank?
  end
  alias is_unitary? is_unitary

  #def to_param
  #  "#{id}-#{name}"
  #end
end
