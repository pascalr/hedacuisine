class Weighing < ApplicationRecord
  belongs_to :machine
  belongs_to :food

  def set_from_dict(dict)
    self.weight = dict["weight"]
    self.food_id = dict["food_id"]
  end
end
