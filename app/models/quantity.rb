# A quantity of a food. Has a value, sometimes a unit.
class Quantity
  attr_reader :unit, :food, :raw, :grams, :ml, :total

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
    @total = @grams / @food.unit_weight if !@grams.nil? && @food && !@food.unit_weight.nil?
    self
  end

  def set_from_value_and_unit(qty, unit)
    factor = unit && unit.value ? unit.value : 1.0
    @unit = unit
    if unit.nil? || unit.is_unitary
      @total = qty * factor
      @grams = @total * @food.unit_weight if @food && !@food.unit_weight.nil?
      @ml = @grams / @food.density if !@grams.nil? && !@food.density.nil?
    elsif unit.is_volume
      @ml = qty * factor
      @grams = @ml * @food.density if @food && !@food.density.nil?
      @total = @grams / @food.unit_weight if !@grams.nil? && @food && !@food.unit_weight.nil?
    else
      @grams = qty * factor
      @ml = @grams / @food.density if @food && !@food.density.nil?
      @toal = @grams / @food.unit_weight if !@grams.nil? && @food && !@food.unit_weight.nil?
    end
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
    return nil if raw.nil?
    @raw = raw
    qty_s = raw[/^\d+( \d)?([,.\/]\d+)?/]
    qty = Quantity.parse_float(qty_s)
    return nil if qty.nil?
    unit_s = raw[qty_s.length..-1].strip
    set_from_value_and_unit(qty, Unit.find_by(name: unit_s))
  end

  def to_raw
    return "#{@total}" if @unit.nil?
    return "#{@total} #{@unit.name}" if @unit.is_unitary
    return "#{@ml/(@unit.value || 1.0)} #{@unit.name}" if @unit.is_volume
    return "#{@grams/(@unit.value || 1.0)} #{@unit.name}"
  end

  #def unit_quantity
  #  return @unitary_qty if @unit.nil? || @unit.is_unitary
  #  return @volume if @unit.is_volume
  #  return @weight
  ##end

  def self.ratio(from, to)
    raise "Invalid quantity ratio" unless from.food == to.food
    from.grams / to.grams
  end

  def *(scalar)
    @grams *= scalar if @grams
    @total *= scalar if @total
    @ml *= scalar if @ml
    self
  end
end
