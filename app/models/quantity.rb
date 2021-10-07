# A quantity of a food. Has a value, sometimes a unit.
class Quantity
  attr_reader :unit, :food, :raw, :weight, :volume, :unitary_qty, :grams, :ml, :total

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
    @grams = @weight * @unit.value if @weight && @unit
    @ml = @volume * @unit.value if @volume && @unit
    @total = @unitary_qty * @unit.value if @unitary_qty && @unit
    self
  end

  def self.parse_float(_qty_s)
    return nil if _qty_s.blank?
    qty_s = _qty_s.strip
    #qty_s = _raw[/^\d+[,./]\d+/]
    if qty_s.include?("/")
      if qty_s.include?(" ")
        whole, fraction = qty_s.split(' ')
        whole.to_i + fraction.to_r.to_f
      else
        qty_s.to_r.to_f
      end
    else
      qty_s.to_f
    end
  end

  def set_from_raw(raw)
    @raw = raw
    qty_s = raw[/^\d+([,.\/]\d+)?/]
    qty = Quantity.parse_float(qty_s)
    return nil, nil if qty.nil?
    unit_s = raw[qty_s.length..-1].strip
    set_from_value_and_unit(qty, Unit.find_by(name: unit_s))
    self
  end

  def to_raw
    return "#{@unitary_qty}" if @unit.nil?
    return "#{@unitary_qty} #{@unit.name}" if @unit.is_unitary
    return "#{@volume} #{@unit.name}" if @unit.is_volume
    return "#{@weight} #{@unit.name}"
  end

  def unit_quantity
    return @unitary_qty if @unit.nil? || @unit.is_unitary
    return @volume if @unit.is_volume
    return @weight
  end

  def self.ratio(from, to)
    return from.unitary_qty / to.unitary_qty unless from.unit && to.unit
    from.grams / to.grams
  end

  def *(scalar)
    @weight *= scalar if @weight
    @unitary_qty *= scalar if @unitary_qty
    @volume *= scalar if @volume
    self
  end
end
