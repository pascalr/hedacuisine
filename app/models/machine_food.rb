require 'ingredient.rb'
class MachineFood < ApplicationRecord
  belongs_to :machine
  belongs_to :food

  before_save :set_grocery_threshold_from_manual
  before_save :set_full_weight_from_manual
  
  def set_from_dict(dict)
    self.grocery_threshold = dict["grocery_threshold"]
    self.current_weight = dict["current_weight"]
    self.full_weight = dict["full_weight"]
  end

  def set_grocery_threshold_from_manual
    unless manual_grocery_threshold.blank?
      self.grocery_threshold = Ingredient.parse_quantity_and_unit_given_food(manual_grocery_threshold, food).weight
    end
  end

  def set_full_weight_from_manual
    unless manual_full_weight.blank?
      self.full_weight = Ingredient.parse_quantity_and_unit_given_food(manual_full_weight, food).weight
    end
  end

end
