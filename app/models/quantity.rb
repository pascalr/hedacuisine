# A quantity of a food. Has a value, sometimes a unit.
class Quantity
  attr_reader :unit, :food, :raw, :weight, :volume, :unitary_qty, :grams, :ml, :total

  def initialize(food)
    @food = food
  end

  # Only grams, ml and total are good. The others are pretty much deprecated
  def set_from_grams(grams)
    @grams = grams
    if grams.nil?
      @ml = nil
      @total = nil
      return self
    end
    @ml = @grams / @food.density if @food && !@food.density.nil?
    @total = @grams / @food.unit_weight if !@weight.nil? && @food && !@food.unit_weight.nil?
    self
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
    factor = @unit ? @unit.value : 1.0
    @grams = @weight * factor if @weight
    @ml = @volume * factor if @volume
    @total = @unitary_qty * factor if @unitary_qty
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
    return nil, nil if raw.nil?
    @raw = raw
    qty_s = raw[/^\d+( \d)?([,.\/]\d+)?/]
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
