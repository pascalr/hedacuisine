module IngredientsHelper
  def close_to_fraction?(value)
    fractions = [1/8r, 1/4r, 1/3r, 1/2r, 2/3r, 3/4r, 1]
    fractions.select { |f|
      return true if (value.to_f - f).abs < 0.02
    }
    false
  end

  def pretty_volume(ing)
    return "#{pretty_fraction(ing.volume/1000.0)} #{translated("L")}" if ing.food.is_liquid? && ing.volume >= 1000.0
    return "#{pretty_fraction(ing.volume/250.0)} #{translated("t")}" if ing.volume >= 60.0# or (ing.volume > 30.0 and close_to_fraction?(ing.volume/250.0))
    return "#{pretty_fraction(ing.volume/15.0)} #{translated("c. à soupe")}" if ing.volume >= 15.0
    return "#{pretty_fraction(ing.volume/5.0)} #{translated("c. à thé")}" if ing.volume >= 5.0/8.0
    "#{pretty_fraction(ing.volume/0.31)} #{translated"pincée"}"
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

  # Translated everything at once because it is easier to translate and it is pretty quick with google translate.
  def translate_complete_instructions(recipe)
    translated(recipe.complete_instructions)
    #steps = recipe.complete_instructions.split('#').map(&:strip).reject(&:blank?).map {|s|
    #  translated(s)
    #}
    #"##{steps.join('#')}"
  end

  # {1,3-4,6} => [1,3,4,6]
  def extract_range_indices(range)
    indices = []
    list = range.split(',')
    list.each do |elem|
      splited = elem.split('-')
      if splited.size > 1
        ((splited[0].to_i)..(splited[1].to_i)).each do |i|
          indices << i
        end
      else
        indices << elem.to_i
      end
    end
    indices
  end

  def pretty_complete_instructions(recipe)
    return nil if recipe.blank? || recipe.complete_instructions.blank?
    translated = translate_complete_instructions(recipe)
    s = "<div>"
    i = 0
    range_started = false
    range = ""
    sanitize(translated).each_char do |c|
      if range_started
        raise "Syntax error. Range already started. {...{" if c == '{'
        if c == '}'
          indices = extract_range_indices(range)
          if indices.length > 1
            ings = recipe.ingredients.where(nb: indices)
            s += "<ul>"
            indices.each do |idx|
              s += "<li>#{pretty_ingredient(ings.find {|ing| ing.nb == idx})}</li>"
            end
            s += "</ul>"
          elsif indices.size == 1
            s += pretty_ingredient(recipe.ingredients.find_by(nb: indices[0]))
          end
          range = ""
          range_started = false
        else
          range += c
        end
      else
        s += case c
             when '#' then "</div><div>#{(i += 1)}."
             when '{' then range_started = true; ''
             when '}' then raise "Syntax error. Missing range start. ?...}"
             else c
             end
      end
    end
    s += "</div>"
    s.html_safe
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
  
end
