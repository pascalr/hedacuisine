class Unit < ApplicationRecord
  belongs_to :language

  def is_unitary
    !self.is_volume and !self.is_weight
  end
  alias is_unitary? is_unitary
end
