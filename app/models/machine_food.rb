class MachineFood < ApplicationRecord
  belongs_to :machine
  belongs_to :food
  
  def set_from_dict(dict)
    self.grocery_threshold = dict["grocery_threshold"]
    self.current_weight = dict["current_weight"]
    self.full_weight = dict["full_weight"]
  end
end
