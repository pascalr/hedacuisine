module IngredientsHelper
  def close_to_fraction?(value)
    fractions = [1/8r, 1/4r, 1/3r, 1/2r, 2/3r, 3/4r, 1]
    fractions.select { |f|
      return true if (value.to_f - f).abs < 0.02
    }
    false
  end

  def pretty_volume_and_weight(ing)
    return nil if ing.weight.nil?
    "#{pretty_volume(ing)} (#{pretty_weight(ing.weight)})"
  end

  def pretty_number(nb, decimals=2)
    sprintf("%g", nb.round(decimals))
  end

  def pretty_weight(weight)
    #return "%.2f kg" % [weight/1000.0] if weight >= 1000.0
    #"%.1f g" % [weight]
    return nil if weight.nil?
    return sprintf("%g kg", (weight/1000.0).round(2)) if weight >= 1000.0
    sprintf("%g g", weight.round(1))
  end

  def pretty_volume_with_metric(ing)
    # TODO: The metric part should be rounded to fit with the generic part.
    "#{pretty_volume(ing)} (#{pretty_metric_volume(ing.volume)})"
  end

  def pretty_metric_volume(volume)
    return sprintf("%g L", (volume/1000.0).round(2)) if volume >= 1000.0
    sprintf("%g mL", volume.round(1))
  end

  def pretty_volume(ing)
    if ing.is_a? RecipeIngredient
      return "" if ing.quantity.blank?
      return "#{pretty_fraction(ing.volume/1000.0)} #{translated("L")}" if ing.food.is_liquid? && ing.volume >= 1000.0
      return "#{pretty_fraction(ing.volume/250.0)} #{translated("t")}" if ing.volume >= 60.0# or (ing.volume > 30.0 and close_to_fraction?(ing.volume/250.0))
      return "#{pretty_fraction(ing.volume/15.0)} #{translated("c. à soupe")}" if ing.volume >= 15.0
      return "#{pretty_fraction(ing.volume/5.0)} #{translated("c. à thé")}" if ing.volume >= 5.0/8.0
      "#{pretty_fraction(ing.volume/0.31)} #{translated"pincée"}"
    else
      return "" if ing.weight.blank?
      return "#{pretty_fraction(ing.volume/1000.0)} #{translated("L")}" if ing.food.is_liquid? && ing.volume >= 1000.0
      return "#{pretty_fraction(ing.volume/250.0)} #{translated("t")}" if ing.volume >= 60.0# or (ing.volume > 30.0 and close_to_fraction?(ing.volume/250.0))
      return "#{pretty_fraction(ing.volume/15.0)} #{translated("c. à soupe")}" if ing.volume >= 15.0
      return "#{pretty_fraction(ing.volume/5.0)} #{translated("c. à thé")}" if ing.volume >= 5.0/8.0
      "#{pretty_fraction(ing.volume/0.31)} #{translated"pincée"}"
    end
  end

  def pretty_base_unit(ing)
    if ing.is_a? RecipeIngredient
      return ""
    else
      return "" if ing.weight.blank?
      ing.food.is_liquid? ? "(#{ing.volume.round(1)} mL)" : "(#{ing.weight.round(1)} g)"
    end
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
  
  #def pretty_recipe_ingredient(ingredient)
  #  return nil unless ingredient
  #  result = ""
  #  if ingredient.is_unitary?
  #    result += (pretty_fraction ingredient.quantity)
  #    str = (ingredient.quantity >= 2) ? ingredient.plural : ingredient.name
  #    result += " #{link_to translated(str.downcase), ingredient.food}"
  #  else
  #    result += pretty_volume(ingredient)
  #    result += " #{link_to translated(ingredient.name.downcase), ingredient.food}"
  #    result += " #{pretty_base_unit(ingredient)}"
  #  end
  #  result.html_safe
  #end

  # FIXME: H aspiré...
  def pretty_preposition(noun)
    noun.start_with?('a','e','i','o','u','y','é') ? "d'" : "de "
  end
  
  # FIXME: H aspiré...
  # FIXME: Rajouter féminin. de la
  def pretty_article(noun)
    noun.start_with?('a','e','i','o','u','y','é') ? "de l'" : "du "
  end
  
  def pretty_ingredient_quantity(ing)
    return "" if ing.quantity.nil?
    return ing.raw_quantity || "" unless ing.unit and ing.unit.show_fraction
    qty_s = pretty_fraction(ing.quantity)
    ing.unit.nil? ? "#{qty_s}" : "#{qty_s} #{ing.unit.name}"
  end

  def pretty_ingredient(ingredient)
    if ingredient.is_a? RecipeIngredient
      result = pretty_ingredient_quantity(ingredient)
      without_unit = (!ingredient.unit || ingredient.unit.is_unitary)
      name = (without_unit && && ingredient.quantity && ingredient.quantity >= 2) ? ingredient.plural : ingredient.name
      if result.blank?
        result += " #{pretty_article(name)}"
      else
        result += " #{without_unit ? "" : pretty_preposition(name)}"
      end
      result += "#{link_to translated(name.downcase), ingredient.food}"
      result.html_safe
    else
      return "" unless ingredient
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

  def replace_ingredients(recipe, text)
    s = ""
    range_started = false
    range = ""
    text.each_char do |c|
      if range_started
        raise "Syntax error. Range already started. {...{" if c == '{'
        if c == '}'
          indices = extract_range_indices(range)
          if indices.length > 1
            ings = recipe.recipe_ingredients.where(item_nb: indices)
            s += "<ul class='recipe-ingredient-list dash'>"
            indices.each do |idx|
              s += "<li>#{pretty_ingredient(ings.find {|ing| ing.item_nb == idx})}</li>"
            end
            s += "</ul>"
          elsif indices.size == 1
            s += pretty_ingredient(recipe.recipe_ingredients.find_by(item_nb: indices[0]))
          end
          range = ""
          range_started = false
        else
          range += c
        end
      else
        s += case c
             when '{' then range_started = true; ''
             when '}' then raise "Syntax error. Missing range start. ?...}"
             else c
             end
      end
    end
    s
  end

  def pretty_complete_instructions(recipe)
    return nil if recipe.blank? || recipe.complete_instructions.blank?
    translated = sanitize(translate_complete_instructions(recipe))
    s = ""
    step_nb = 0
    translated.each_line do |line|
      if line.starts_with?("_")
        s += "<h3>#{line[1..-1].strip}</h3>"
      elsif line.starts_with?("#")
        s += "<div><span class='step-number'>#{(step_nb += 1)}</span>#{replace_ingredients(recipe, line[1..-1])}</div>"
      else
        s += line
      end
    end
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
