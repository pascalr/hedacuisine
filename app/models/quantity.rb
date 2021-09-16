# A quantity of a food. Has a value, sometimes a unit.
class Quantity
  attr_reader :unit, :food, :raw, :weight, :volume, :unitary_qty

  def initialize(food)
    @food = food
  end

  def set_from_value_and_unit(qty, unit)
    @unit = unit
    if @unit.nil? || @unit.is_unitary
      @unitary_qty = qty
      @weight = qty * @food.unit_weight if @food && !@food.unit_weight.nil?
      @volume = @weight / @food.density if !@weight.nil? && !@food.density.nil?
    elsif @unit.is_volume
      @volume = qty
      @weight = @volume * @food.density if @food && !@food.density.nil?
      @unitary_qty = @weight / @food.unit_weight if !@weight.nil? && @food && !@food.unit_weight.nil?
    else
      @weight = qty
      @volume = @weight / @food.density if @food && !@food.density.nil?
      @unitary_qty = @weight / @food.unit_weight if !@weight.nil? && @food && !@food.unit_weight.nil?
    end
    self
  end

  def set_from_raw(raw)
    @raw = raw
    qty_s = raw[/^\d+([,.\/]\d+)?/]
    qty = nil
    return nil, nil if qty_s.blank?
    #qty_s = _raw[/^\d+[,./]\d+/]
    if qty_s.include?("/")
      qty = qty_s.to_r.to_f
    else
      qty = qty_s.to_f
    end
    unit_s = raw[qty_s.length..-1].strip
    set_from_value_and_unit(qty, Unit.find_by(name: unit_s))
    self
  end

  def unit_quantity
    return @unitary_qty if @unit.nil? || @unit.is_unitary
    return @volume if @unit.is_volume
    return @weight
  end

  def *(scalar)
    @weight *= scalar
    @unitary_qty *= scalar
    @volume *= scalar
  end
end
