module ApplicationHelper

  def current_language
    @current_language ||= Language.find_by(locale: params[:locale])
  end

  def current_unit_system
    params[:unit_system_id] ? UnitSystem.find(params[:unit_system_id]) : UnitSystem.default
  end

  def link_to_active(name, path, options={})
    options[:class] += " active" if current_page?(path)
    link_to name, path, options
  end

  def pretty_ingredient_value(ing, unit)
    value = ing.value_for(unit)
    return number_with_precision value, precision: 2, strip_insignificant_zeros: true if unit.blank? or not unit.show_fraction
    #fractions = [1/8r, 1/4r, 1/3r, 3/8r, 1/2r, 5/8r, 2/3r, 3/4r, 7/8r]
    fractions = [0, 1/4r, 1/3r, 1/2r, 2/3r, 3/4r, 7/8r, 1]
    f_part = value.modulo(1)
    i = fractions.index { |f| (f.to_f-f_part).abs < 0.04 }
    return number_with_precision value, precision: 2, strip_insignificant_zeros: true if i == nil
    return value.to_i.to_s if i == 0
    return (value.to_i+1).to_s if i == fractions.size - 1
    return fractions[i] if value.to_i == 0
    "#{value.to_i} #{fractions[i]}"
    #value.to_r.rationalize(0.125)
  end
end
