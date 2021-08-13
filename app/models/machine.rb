class Machine < ApplicationRecord
  has_many :containers
  has_many :weighings
  has_many :machine_foods

  def containers_by_food_id
    r = {}
    containers.each do |c|
      if c.ingredients.size == 1
        food_id = c.ingredients.first.food_id
        r[food_id] = (r[food_id] || []) << c
      end
    end
    r
  end
end
