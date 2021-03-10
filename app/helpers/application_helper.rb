module ApplicationHelper

  def current_language
    @current_language ||= Language.find_by(locale: params[:locale])
  end

  def current_user_admin?
    current_user && current_user.admin?
  end

  def current_unit_system
    params[:unit_system_id] ? UnitSystem.find(params[:unit_system_id]) : UnitSystem.default
  end

  def link_to_active(name, path, options={})
    options[:class] += " active" if current_page?(path)
    link_to name, path, options
  end

  #def pretty_ingredient_value(value, unit)
  #  return number_with_precision value, precision: 2, strip_insignificant_zeros: true if unit.blank? or not unit.show_fraction
  #  #fractions = [1/8r, 1/4r, 1/3r, 3/8r, 1/2r, 5/8r, 2/3r, 3/4r, 7/8r]
  #  fractions = [0, 1/4r, 1/3r, 1/2r, 2/3r, 3/4r, 7/8r, 1]
  #  f_part = value.modulo(1)
  #  i = fractions.index { |f| (f.to_f-f_part).abs < 0.04 }
  #  return number_with_precision value, precision: 2, strip_insignificant_zeros: true if i == nil
  #  return value.to_i.to_s if i == 0
  #  return (value.to_i+1).to_s if i == fractions.size - 1
  #  return fractions[i] if value.to_i == 0
  #  "#{value.to_i} #{fractions[i]}"
  #  #value.to_r.rationalize(0.125)
  #end
  
  def close_to_fraction?(value)
    fractions = [1/8r, 1/4r, 1/3r, 1/2r, 2/3r, 3/4r, 1]
    fractions.select { |f|
      return true if (value.to_f - f).abs < 0.02
    }
    false
  end
  
  def pretty_fraction(value)
    fractions = [0, 1/8r, 1/4r, 1/3r, 1/2r, 2/3r, 3/4r, 1]
    i_part = value.to_i
    f_part = value.modulo(1)
    f = fractions.min_by {|x| (f_part-x).abs}
    return i_part.to_s if f == 0
    return (i_part+1).to_s if f == 1
    return f.to_s if i_part == 0
    "#{i_part} #{f}"
  end

  def pretty_volume(ing)
    return "#{pretty_fraction(ing.volume/1000.0)} L" if ing.food.is_liquid? && ing.volume >= 1000.0
    return "#{pretty_fraction(ing.volume/250.0)} t" if ing.volume >= 250.0 or (ing.volume > 30.0 and close_to_fraction?(ing.volume/250.0))
    return "#{pretty_fraction(ing.volume/15.0)} c. à soupe" if ing.volume >= 15.0
    "#{pretty_fraction(ing.volume/5.0)} c. à thé"
  end

  def pretty_base_unit(ing)
    ing.food.is_liquid? ? "(#{ing.volume.round(1)} mL)" : "(#{ing.weight.round(1)} g)"
  end

end
