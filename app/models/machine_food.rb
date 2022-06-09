class MachineFood < ApplicationRecord
  belongs_to :machine
  belongs_to :food

  before_save :set_grocery_threshold_from_manual
  before_save :set_full_weight_from_manual

  has_many :container_ingredients

  has_many :container_quantities, dependent: :delete_all
  #accepts_nested_attributes_for :container_quantities, reject_if: :all_blank
  accepts_nested_attributes_for :container_quantities, reject_if: lambda {|attributes| attributes['full_qty'].blank? and attributes['grocery_qty'].blank?}
  #accepts_nested_attributes_for :container_quantities, reject_if: lambda {|attributes| attributes['full_qty'].blank?}

  #has_many :grocery_container_quantities, -> { where attachable_type: "ContainerQuantity" }, foreign_key: :containable_id, class_name: "ContainerQuantity", dependent: :destroy
  #has_many :full_container_quantities, -> { where attachable_type: "ContainerQuantity" }, foreign_key: :containable_id, class_name: "ContainerQuantity", dependent: :destroy


  delegate :name, to: :food
  
  def set_from_dict(dict)
    self.grocery_threshold = dict["grocery_threshold"]
    self.current_weight = dict["current_weight"]
    self.full_weight = dict["full_weight"]
  end

  def set_grocery_threshold_from_manual
    raise "deprectated: Use Quantity"
    unless manual_grocery_threshold.blank?
      self.grocery_threshold = Ingredient.parse_quantity_and_unit_given_food(manual_grocery_threshold, food).weight
    end
  end

  def set_full_weight_from_manual
    raise "deprectated: Use Quantity"
    unless manual_full_weight.blank?
      self.full_weight = Ingredient.parse_quantity_and_unit_given_food(manual_full_weight, food).weight
    end
  end

  def calc_grocery_threshold
    container_quantities.map {|c| c.grocery_qty * c.container_format.volume}.inject(&:+) * food.density
  end

  def update_grocery_threshold
    threshold = calc_grocery_threshold
    if grocery_threshold != threshold
      self.update!(grocery_threshold: threshold)
    end
  end
  
  def calc_full_weight
    container_quantities.map {|c| c.full_qty * c.container_format.volume}.inject(&:+) * food.density
  end
  
  def update_full_weight
    full = calc_full_weight
    if full_weight != full
      self.update!(full_weight: full)
    end
  end

  def to_obj(params={})
    extract_attributes(params, :machine_id, :food_id, :name)
  end

end
