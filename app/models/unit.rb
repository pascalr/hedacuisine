class Unit < ApplicationRecord
  #belongs_to :language # deprecated
  belongs_to :region
  
  validates :name, presence: true#, uniqueness: true

  def is_unitary
    !self.is_volume and !self.is_weight
  end
  alias is_unitary? is_unitary
  
  def to_obj(params={})
    extract_attributes(params, :name, :value, :is_weight, :is_volume, :show_fraction)
  end
end
