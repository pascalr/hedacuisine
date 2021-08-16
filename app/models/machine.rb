class Machine < ApplicationRecord
  has_many :weighings
  has_many :machine_foods
  has_many :containers
  has_many :grocery_items
  
  has_many :machine_users
  has_many :users, through: :machine_users

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

  # For every machine food that don't have enough in containers,
  # set the food of an emtpy container to this food.
  def generate_grocery_list#(machine_foods, containers)
    available_containers = containers.left_outer_joins(:container_ingredients).where(container_ingredients: { id: nil }, food_id: nil)
    assigned_containers = containers.left_outer_joins(:container_ingredients).where(container_ingredients: { id: nil }).where.not(food_id: nil)
    machine_foods.includes(:food).where('current_weight <= grocery_threshold OR (current_weight IS NULL AND grocery_threshold IS NOT NULL)').each do |machine_food|
      missing = machine_food.full_weight - (machine_food.current_weight || 0.0)
      assigned_containers.each do |assigned|
        if assigned.food_id == machine_food.food_id
          missing -= assigned.container_format.volume * machine_food.food.density
        end
      end
      while missing > 0.0
        # FIXME: Edge case. Handle when there are multiple container formats
        format = machine_food.container_quantities.first.container_format
        container = available_containers.find {|c| c.container_format_id == format.id}
        raise "No available containers" if container.nil?
        missing -= format.volume * machine_food.food.density
        container.update!(food_id: machine_food.food.id)
      end
    end
  end
end
