module IngredientsHelper
  def pretty_value(ing)
    return number_with_precision ing.value, precision: 2, strip_insignificant_zeros: true if ing.unit.blank? or not ing.unit.show_fraction
    #fractions = [1/8r, 1/4r, 1/3r, 3/8r, 1/2r, 5/8r, 2/3r, 3/4r, 7/8r]
    fractions = [0, 1/4r, 1/3r, 1/2r, 2/3r, 3/4r, 7/8r, 1]
    f_part = ing.value.modulo(1)
    i = fractions.index { |f| (f.to_f-f_part).abs < 0.04 }
    return number_with_precision ing.value, precision: 2, strip_insignificant_zeros: true if i == nil
    return ing.value.to_i.to_s if i == 0
    return (ing.value.to_i+1).to_s if i == fractions.size - 1
    return fractions[i] if ing.value.to_i == 0
    "#{ing.value.to_i} #{fractions[i]}"
    #value.to_r.rationalize(0.125)
  end
end
