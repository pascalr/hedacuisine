module IngredientsHelper
  def close_to_fraction?(value)
    fractions = [1/8r, 1/4r, 1/3r, 1/2r, 2/3r, 3/4r, 7/8r, 1]
    fractions.select { |f|
      return true if (value.to_f - f).abs < 0.02
    }
    false
  end

  def scalable_unit(_qty, _unit)
    # TODO: Ability to change between types of units (unités -> douzaine) Ouin vraiment pas tant important pour l'instant...
  end

  def scalable_weight(_qty, _unit)
    # TODO: Ability to change between types of weight (500g -> 1kg)
  end

  def scalable_volume(ml, is_liquid)
    # Ability to change between types of volume (c. à thé -> c. à table)
    "<span data-scalable-volume='#{ml}'>#{pretty_volume_from_ml(ml, is_liquid)}</span>".html_safe
  end

  def scalable_qty(_qty)
    qty_s = sanitize(_qty.to_s)
    qty = Quantity.parse_float(qty_s)
    if qty_s.include? "/"
      "<span data-scalable-qty='#{qty}' data-show-fraction='true'>#{qty_s}</span>".html_safe
    else
      "<span data-scalable-qty='#{qty}'>#{qty_s}</span>".html_safe
    end
  end

  def pretty_time(minutes)
    hours = minutes.to_i / 60
    other_minutes = minutes - hours*60
    r = ""
    r += "#{hours} #{translated("heure")} " if hours == 1
    r += "#{hours} #{translated("heures")} " if hours > 1
    r += "#{other_minutes} #{translated("minute")}" if other_minutes == 1
    r += "#{other_minutes} #{translated("minutes")}" if other_minutes > 1
    r.strip
  end

  def pretty_volume_and_weight(ing)
    return nil if ing.nil? or ing.weight.nil?
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
    return nil if ing.quantity.nil?
    "#{pretty_volume(ing)} (#{pretty_metric_volume(ing.volume)})"
  end

  def pretty_metric_volume(volume)
    return nil if volume.nil?
    return sprintf("%g L", (volume/1000.0).round(2)) if volume >= 1000.0
    sprintf("%g mL", volume.round(1))
  end

  def pretty_volume_from_ml(ml, is_liquid)
    return "" if ml.blank?
    return "#{pretty_fraction(ml/1000.0)} #{translated("L")}" if is_liquid && ml >= 1000.0
    return "#{pretty_fraction(ml/250.0)} #{translated("t")}" if ml >= 60.0# or (ing.volume > 30.0 and close_to_fraction?(ing.volume/250.0))
    return "#{pretty_fraction(ml/15.0)} #{translated("c. à soupe")}" if ml >= 15.0
    return "#{pretty_fraction(ml/5.0)} #{translated("c. à thé")}" if ml >= 5.0/8.0
    "#{pretty_fraction(ml/0.31)} #{translated"pincée"}"
  end

  def pretty_volume(ing)
    return "" if ing.nil? or ing.quantity.blank?
    pretty_volume_from_ml(ing.volume, ing.food.is_liquid?)
  end

  def pretty_base_unit(ing)
    return "" if ing.weight.blank?
    ing.food.is_liquid? ? "(#{ing.volume.round(1)} mL)" : "(#{ing.weight.round(1)} g)"
  end
  
  def pretty_fraction(value)
    fractions = [0, 1/8r, 1/4r, 1/3r, 1/2r, 2/3r, 3/4r, 7/8r, 1]
    i_part = value.to_i
    f_part = value.modulo(1)
    f = fractions.min_by {|x| (f_part-x).abs}
    return i_part.to_s if f == 0
    return (i_part+1).to_s if f == 1
    return f.to_s if i_part == 0
    "#{i_part} #{f}"
  end

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
    return "" if ing.nil? or ing.quantity.nil? or ing.raw_quantity.nil?
    return "#{scalable_qty(ing.raw_quantity)}" unless ing.unit and ing.unit.show_fraction
    if ing.unit.is_volume?
      "#{scalable_volume(ing.quantity_model.ml, ing.food.is_liquid?)}"
    else
      "#{scalable_qty(pretty_fraction(ing.quantity))} #{ing.unit.name}"
    end
  end

  def pretty_substitution(ing, substitution)

    actual_quantity = Quantity.new(ing.food).set_from_value_and_unit(ing.quantity, ing.unit)
    substitution_quantity = Quantity.new(ing.food).set_from_raw(substitution.food_raw_qty_for(ing.food))
    ratio = actual_quantity.weight.to_f / substitution_quantity.weight.to_f
    
    food = substitution.substitute_for(ing.food)
    sub_qty = Quantity.new(food).set_from_raw(substitution.food_raw_qty_for(food))
    r = "#{pretty_fraction(sub_qty.unit_quantity * ratio)} "
    r += "#{sub_qty.unit.name} " if sub_qty.unit
    r += pretty_preposition(food.name) if sub_qty.unit
    r += food.name
    r
  end

  def pretty_inline_ingredient(ingredient)
    result = pretty_ingredient_quantity(ingredient)
    without_unit = (!ingredient.unit || ingredient.unit.is_unitary)
    name = (without_unit && ingredient.quantity && ingredient.quantity >= 2) ? ingredient.plural : ingredient.name
    if result.blank?
      result += " #{pretty_article(name)}"
    else
      result += " #{without_unit ? "" : pretty_preposition(name)}"
    end
    result += "#{link_to translated(name.downcase), ingredient.food}"
    result += " #{my_sanitize ingredient.comment}" if ingredient.comment
    result.html_safe
  end

  def pretty_ingredient_with_conversions(ing)
    r = "#{pretty_ingredient(ing)}"
    r += " <i style='color: gray;'>("
    if ing.unit.nil? or ing.unit.is_unitary
      r += "#{pretty_volume(ing)} | #{pretty_metric_volume(ing.volume)} | #{pretty_weight(ing.weight)}"
    elsif ing.unit.is_weight
      # TODO: Show unit quantity if food can be unit.
      r += "#{pretty_volume(ing)} | #{pretty_metric_volume(ing.volume)}"
    else
      # TODO: Show unit quantity if food can be unit.
      r += "#{pretty_metric_volume(ing.volume)} | #{pretty_weight(ing.weight)}"
    end
    r += ")</i>"
    r.html_safe
  end

  def pretty_ingredient(ingredient)
    return nil if ingredient.nil?
    result = pretty_ingredient_quantity(ingredient)
    without_unit = (!ingredient.unit || ingredient.unit.is_unitary)
    name = (without_unit && ingredient.quantity && ingredient.quantity >= 2) ? ingredient.plural : ingredient.name
    unless result.blank?
      result += " #{without_unit ? "" : pretty_preposition(name)}"
    end
    result += "#{link_to translated(name.downcase), ingredient.food}"
    result += " #{my_sanitize ingredient.comment}" if ingredient.comment
    result.html_safe
  end

  # Translated everything at once because it is easier to translate and it is pretty quick with google translate.
  def translate_complete_instructions(recipe)
    translated(recipe.complete_instructions)
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
          if range.include? "."
            s += " #{pretty_fraction(range.to_f)} "
          else
            indices = extract_range_indices(range)
            if indices.length > 1
              ings = recipe.recipe_ingredients.where(item_nb: indices)
              s += "<ul class='recipe-ingredient-list dash'>"
              indices.each do |idx|
                s += "<li>#{pretty_ingredient(ings.find {|ing| ing.item_nb == idx})}</li>"
              end
              s += "</ul>"
            elsif indices.size == 1
              s += pretty_inline_ingredient(recipe.recipe_ingredients.find_by(item_nb: indices[0]))
            end
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

  def my_sanitize(s)
    sanitize s, attributes: %w(id class href)
  end

  def pretty_complete_instructions(recipe)
    return nil if recipe.blank? || recipe.complete_instructions.blank?
    translated = my_sanitize(translate_complete_instructions(recipe))
    replaced = replace_ingredients(recipe, translated)
    s = ""
    step_nb = 0
    toggle_block = 0
    replaced.each_line do |raw_line|
      line = raw_line.strip
      if line.starts_with?("_")
        s += "<h3>#{line[1..-1].strip}</h3>"
      elsif line.starts_with?("$$$-")
        s += "<h5>#{line[3..-1].strip}</h5>"
      elsif line.starts_with?("$$-")
        s += "<h4>#{line[2..-1].strip}</h4>"
      elsif line.starts_with?("$-")
        s += "<h3 class='toggle-link-visible' data-toggle-id='toggle-block-#{toggle_block += 1}'>#{line[1..-1].strip}</h3>"
      elsif line.starts_with?("$$$")
        s += "<h5>#{line[3..-1].strip}</h5>"
      elsif line.starts_with?("$$")
        s += "<h4>#{line[2..-1].strip}</h4>"
      elsif line.starts_with?("$")
        s += "<h3>#{line[1..-1].strip}</h3>"
      elsif line.starts_with?("/")
        s += "<p><i>#{line[1..-1].strip}</p></i>"
      elsif line.starts_with?("!")
        cmd = line[1..-1].strip
        if cmd == "reset-list"
          step_nb = 0
        # TODO: Handle error
        end
      elsif line.starts_with?("#")
        s += "<div><span class='step-number'>#{(step_nb += 1)}</span>#{line[1..-1]}</div>"
      else
        s += line
      end
    end
    s.html_safe
  end
  
end
