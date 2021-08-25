class Unit < ApplicationRecord
  belongs_to :language
  
  validates :name, presence: true, uniqueness: true

  def is_unitary
    !self.is_volume and !self.is_weight
  end
  alias is_unitary? is_unitary
end
