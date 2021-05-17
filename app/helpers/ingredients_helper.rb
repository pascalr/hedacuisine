module IngredientsHelper
  def pretty_volume(ing)
    return "#{pretty_fraction(ing.volume/1000.0)} L" if ing.food.is_liquid? && ing.volume >= 1000.0
    return "#{pretty_fraction(ing.volume/250.0)} t" if ing.volume >= 250.0 or (ing.volume > 30.0 and close_to_fraction?(ing.volume/250.0))
    return "#{pretty_fraction(ing.volume/15.0)} c. à soupe" if ing.volume >= 15.0
    return "#{pretty_fraction(ing.volume/5.0)} c. à thé" if ing.volume >= 5.0/8.0
    "#{pretty_fraction(ing.volume/0.31)} pincée"
  end

  def pretty_base_unit(ing)
    ing.food.is_liquid? ? "(#{ing.volume.round(1)} mL)" : "(#{ing.weight.round(1)} g)"
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

  def pretty_ingredient(ingredient)
    return nil unless ingredient
    result = ""
    if ingredient.is_unitary?
      result += (pretty_fraction ingredient.nb_units)
      str = (ingredient.nb_units >= 2) ? ingredient.plural : ingredient.name
      result += " #{link_to translated(str.downcase), ingredient.food}"
    else
      result += pretty_volume(ingredient)
      result += " #{link_to translated(ingredient.name.downcase), ingredient.food}"
      result += " #{pretty_base_unit(ingredient)}"
    end
    result.html_safe
  end
end
