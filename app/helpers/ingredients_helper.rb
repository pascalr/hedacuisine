module IngredientsHelper
  def close_to_fraction?(value)
    fractions = [1/8r, 1/4r, 1/3r, 1/2r, 2/3r, 3/4r, 7/8r, 1]
    fractions.select { |f|
      return true if (value.to_f - f).abs < 0.02
    }
    false
  end

  # 2 oignons => 1 oignon
  def scalable_ingredient(ing)
    return nil unless ing
    qty = ing.quantity_model
    content_tag :span, id: "ingredient-#{ing.id}", data: {"scalable-ingredient": true, grams: qty.grams, ml: qty.ml, total: qty.total, raw: ing.raw, "food-name-singular": ing.name, "food-name-plural": ing.food ? ing.food.plural_in(current_language) : '', preposition: pretty_preposition(ing.food), "food-id": ing.food_id, "comment": my_sanitize(ing.comment_html)} do
      pretty_ingredient(ing)
    end
  end

  def pretty_ingredient_with_conversions(ing)
    r = "#{pretty_ingredient(ing)}"
    return r.html_safe unless ing.has_quantity?
    r = "<div style='display: inline-block;'>" + r + "&nbsp;</div><span class='ingredient-details'>("
    qty = Quantity.new(ing.food).set_from_raw(ing.raw)
    if qty.unit.nil? or qty.unit.is_unitary # ·
      # I don't show volume here, because for whole ingredients, the volume
      # usualy depends on the way it is cut. Big chunks volume != small chunks volume
      # #{pretty_volume(ing)} — #{pretty_metric_volume(ing.volume)} — 
      r += "#{pretty_weight(ing.weight)}"
    elsif qty.unit.is_weight
      # TODO: Show unit quantity if food can be unit.
      r += "#{pretty_volume(ing)} · #{pretty_metric_volume(ing.volume)}"
    else
      # TODO: Show unit quantity if food can be unit.
      r += "#{pretty_metric_volume(ing.volume)} · #{pretty_weight(ing.weight)}"
    end
    r += ")</span>"
    r.html_safe
  end

  # 1 oignon (1/2 t | 110 mL | 110 g) => 2 oignons (7/8 t | 220 mL | 220 g)
  def scalable_detailed_ingredient(ing)
    return scalable_ingredient(ing) if ing.food.nil? or !ing.food.is_public
    qty = ing.quantity_model
    content_tag :span, id: "ingredient-#{ing.id}", class: "ingredient-list-item", data: {"scalable-ingredient-detailed": true, grams: qty.grams, ml: qty.ml, total: qty.total, raw: ing.raw, "food-name-singular": ing.food.name, "food-name-plural": ing.food.plural_in(current_language), preposition: pretty_preposition(ing.food), "food-id": ing.food.id, "comment": my_sanitize(ing.comment_html)} do
      pretty_ingredient_with_conversions(ing)
    end
  end

  def scalable_unit(_qty, _unit)
    # TODO: Ability to change between types of units (unités -> douzaine) Ouin vraiment pas tant important pour l'instant...
  end

  def scalable_weight(grams)
    "<span data-scalable-weight='#{grams}'>#{pretty_weight(grams)}</span>".html_safe
  end

  def scalable_volume(ml, is_liquid)
    # Ability to change between types of volume (c. à thé -> c. à table)
    if is_liquid
      "<span data-is-liquid='true' data-scalable-volume='#{ml}'>#{pretty_volume_from_ml(ml, is_liquid)}</span>".html_safe
    else
      "<span data-scalable-volume='#{ml}'>#{pretty_volume_from_ml(ml, is_liquid)}</span>".html_safe
    end
  end

  def scalable_qty(_qty)
    qty_s = sanitize(_qty.to_s)
    qty = Quantity.parse_float(qty_s)
    "<span data-scalable-qty='#{qty}'>#{pretty_fraction(qty)}</span>".html_safe
    #if qty_s.include? "/"
    #  "<span data-scalable-qty='#{qty}' data-show-fraction='true'>#{qty_s}</span>".html_safe
    #else
    #  "<span data-scalable-qty='#{qty}'>#{qty_s}</span>".html_safe
    #end
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
    number_with_precision(Quantity.parse_float(nb), precision: 3, significant: true, strip_insignificant_zeros: true, separator: '.').to_s
    #sprintf("%g", nb.round(decimals))
  end

  def pretty_weight(weight)
    #return "%.2f kg" % [weight/1000.0] if weight >= 1000.0
    #"%.1f g" % [weight]
    return nil if weight.nil?
    return "#{pretty_number(weight/1000.0)} kg" if weight >= 1000.0
    #return sprintf("%g kg", (weight/1000.0).round(2)) if weight >= 1000.0
    #sprintf("%g g", weight.round(1))
    "#{pretty_number(weight)} g"
  end

  def pretty_volume_with_metric(ing)
    # TODO: The metric part should be rounded to fit with the generic part.
    return nil if ing.quantity.nil?
    "#{pretty_volume(ing)} (#{pretty_metric_volume(ing.volume)})"
  end

  def pretty_metric_volume(volume)
    return nil if volume.nil?
    #return sprintf("%g L", (volume/1000.0).round(2)) if volume >= 1000.0
    #sprintf("%g mL", volume.round(1))
    return "#{pretty_number(volume/1000.0)} L" if volume >= 1000.0
    "#{pretty_number(volume)} mL"
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
  def pretty_preposition(food)
    return nil if food.nil?
    exp = food.expression.in(current_language)
    return food.name.start_with?('a','e','i','o','u','y','é') ? "d'" : "de " if exp.contract_preposition.nil?
    exp.contract_preposition ? "d'" : "de "
  end
  
  # FIXME: H aspiré...
  # FIXME: Rajouter féminin. de la
  def pretty_article(noun)
    noun.start_with?('a','e','i','o','u','y','é') ? "de l'" : "du "
  end
  
  def pretty_substitution(ing, substitution)

    actual_quantity = Quantity.new(ing.food).set_from_grams(ing.quantity.grams)
    #actual_quantity = Quantity.new(ing.food).set_from_value_and_unit(ing.quantity, ing.unit)
    substitution_quantity = Quantity.new(ing.food).set_from_raw(substitution.food_raw_qty_for(ing.food))
    gs = substitution_quantity.grams.to_f
    return nil if gs.blank? || gs == 0.0 # It may happen when the food density or the food unit weigth is missing)
    ratio = actual_quantity.grams.to_f / gs
    
    food = substitution.substitute_for(ing.food)
    sub_qty = Quantity.new(food).set_from_raw(substitution.food_raw_qty_for(food))
    if sub_qty.unit && sub_qty.unit.is_volume?
      r = "#{scalable_volume(sub_qty.ml * ratio, false)} "
    elsif sub_qty.unit && sub_qty.unit.is_weight?
      r = "#{scalable_weight(sub_qty.grams * ratio)} "
    else
      r = "#{scalable_qty(sub_qty.total * ratio)} "
      r += "#{sub_qty.unit.name} " if sub_qty.unit
    end
    #r = "#{pretty_fraction(sub_qty.unit_quantity * ratio)} "
    #r += "#{sub_qty.unit.name} " if sub_qty.unit
    r += pretty_preposition(food) if sub_qty.unit
    r += food.name
    r.html_safe # FIXME: Is it?
  end

  def pretty_ingredient_qty(ing)
    return nil if ing.nil?

    return "" if ing.nil? or ing.raw.blank?
    qty = Quantity.new(ing.food).set_from_raw(ing.raw)
    return "" unless qty
    if qty.unit and qty.unit.is_volume?
      return "#{pretty_volume_from_ml(qty.ml, ing.food.is_liquid?)}"
    elsif qty.unit and qty.unit.is_weight?
      return "#{pretty_weight(qty.grams)}"
    elsif !ing.raw.blank?
      return "#{ing.raw}" # FIXME: This is not html safe...
    end
    result
  end

  def pretty_food(name, food)
    "<span class='food-name'>#{food && food.is_public ? "#{link_to translated(name), food}" : translated(name)}</span>"
  end

  def pretty_ingredient(ing)
    return nil if ing.nil?

    result = "" if ing.nil? or ing.quantity.nil? or ing.raw.blank?
    qty = Quantity.new(ing.food).set_from_raw(ing.raw)
    if qty
      if qty.unit and qty.unit.is_volume?
        if ing.food
          result = "#{pretty_volume_from_ml(qty.ml, ing.food.is_liquid?)}"
        else
          result = "#{ing.raw}" # FIXME: This is not html safe...
        end
      elsif qty.unit and qty.unit.is_weight?
        result = "#{pretty_weight(qty.grams)}"
      elsif !ing.raw.blank?
        result = "#{ing.raw}" # FIXME: This is not html safe...
      end

      without_unit = (!qty.unit || qty.unit.is_unitary)
      name = (without_unit && qty.total && qty.total >= 2 && ing.food) ? ing.food.plural_in(current_language) : ing.name
      name = ing.name if name.blank? # If the plural is missing
      unless result.blank?
        result += " #{without_unit ? "" : pretty_preposition(ing.food)}"
      end
      result += pretty_food(name.downcase, ing.food)
    else
      result += pretty_food(ing.name.downcase, ing.food)
    end
    result += " #{my_sanitize my_sanitize(ing.comment_html)}" if ing.comment_html
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
            s += " #{scalable_qty(range.to_f)} "
          else
            indices = extract_range_indices(range)
            if indices.length > 1
              ings = recipe.recipe_ingredients.where(item_nb: indices)
              s += "<ul class='recipe-ingredient-list dash'>"
              indices.each do |idx|
                s += "<li>#{scalable_ingredient(ings.find {|ing| ing.item_nb == idx})}</li>"
              end
              s += "</ul>"
            elsif indices.size == 1
              s += scalable_ingredient(recipe.recipe_ingredients.find_by(item_nb: indices[0])) || ""
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

  def replace_paragraph_spacing(text)
    return nil if text.nil?
    text.gsub(/(\r?\n){2}/, "<br><br>")
  end

  def replace_links(text)
    raise "deprecated"
    return nil if text.nil?
    # link syntaxes:
    # [note: 1]
    # [link_note: 1]
    # [recipe: 100]
    # [food: 100]
    # [url: "http://www.hedacuisine.com/"]
    # [label: "home", url: "http://www.hedacuisine.com/"]
    text.gsub(/\[[^\[\]]+\]/) do |raw_link|
      args = {}
      # FIXME: Don't split in semicolon inside a string
      raw_link[1..-2].split(";").each do |a|
        s = a.split(":", 2)
        args[s[0].strip.to_sym] = s[1].strip unless s[1].nil?
      end
      if args[:img]
        style = ""
        style += "width: #{args[:width]};" if args[:width] # FIXME: This is not safe... TODO: Validate. Must be px for now.
        style += "float: #{args[:float]};" if args[:float] # FIXME: This is not safe...
        render partial: Image.find(args[:img]), locals: {style: style}
      elsif args[:note]
        "<span id='note-#{args[:note]}'>[#{args[:note]}]</span>"
      elsif args[:link_note]
        link_to args[:label] || "[#{args[:link_note]}]", "#note-#{args[:link_note]}"
      elsif args[:recipe]
        r = Recipe.find(args[:recipe])
        link_to args[:label] || r.name, r
      elsif args[:food]
        f = Food.find(args[:food])
        link_to args[:label] || f.name, f
      else
        #raise "Missing required link argument. For: #{raw_link}. Got: #{args}"
        puts "Missing required link argument. For: #{raw_link}. Got: #{args}"
      end
    end
  end

  def my_sanitize(s)
    sanitize s, attributes: %w(id class href data-ingredient data-step data-link-model)
  end

  def pretty_complete_instructions(recipe)
    return nil if recipe.blank? || recipe.complete_instructions.blank?
    translated = my_sanitize(translate_complete_instructions(recipe))
    replaced = replace_ingredients(recipe, translated)
    replaced = replace_links(replaced)
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

  def description_recipe_ingredients(recipe)
    "Ingrédients: " + recipe.ingredients_ordered_by_weight.map(&:name).join(" · ")
  end

  def sanitize_article(s)
    sanitize s, attributes: %w(id class href src style)
  end
  
  def pretty_instruction_text(recipe)
    return nil if recipe.blank? || recipe.html.blank?
    #translated = my_sanitize(translate_complete_instructions(recipe))
    #replaced = replace_ingredients(recipe, recipe.text.body.to_trix_html)
    #replaced = replace_ingredients(recipe, recipe.text)
    my_sanitize(recipe.html)
  end

  def pretty_article_text(text)
    replaced = replace_links(text)
    replaced = replace_paragraph_spacing(replaced)
    sanitize_article replaced
  end
  
end
