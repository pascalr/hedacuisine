class MachineFood < ApplicationRecord
  belongs_to :machine
  belongs_to :food
end
