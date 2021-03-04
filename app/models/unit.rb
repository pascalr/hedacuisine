class Unit < ApplicationRecord
  belongs_to :language
  
  validates :name, presence: true, uniqueness: true
  
  before_save do
    name.downcase!
  end

  def is_unitary
    !self.is_volume and !self.is_weight
  end
  alias is_unitary? is_unitary
end
