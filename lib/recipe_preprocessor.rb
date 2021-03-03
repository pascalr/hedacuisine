require Rails.root().join("lib").join("utils.rb")

# FIXME: Should send back the errors instead of raise
def parseIngredientQuantity(quantity, unit_or_ingredient_name, ingredient_name)
    
  raise "Invalid quantity #{quantity}" unless (quantity.to_i.to_s == quantity.to_s or
                                               quantity.to_f.to_s == quantity.to_s)
  if (ingredient_name)
    unit = Unit.where('lower(name) = ?', unit_or_ingredient_name).first
    raise "Invalid unit #{unit_or_ingredient_name}" unless unit
  else
    unit = Unit.unitary
  end

  ingredient_name = ingredient_name || unit_or_ingredient_name
  ingredient = Ingredient.where('lower(name) = ?', ingredient_name).first
  raise "Invalid ingredient #{ingredient_name}" unless ingredient
  puts "Creating ingredient quantity #{quantity.to_f}, #{unit.name}, #{ingredient.name}"
  IngredientQuantity.new(value: quantity.to_f, unit: unit, ingredient: ingredient)
end

# Defines specific rules for some instructions.
module RecipeCommands
  #def faire(quantity, ingredient_name) # could that a unit too
  #  ingredient = Ingredient.where('lower(name) = ?', ingredient_name).first
  #  raise "Invalid ingredient #{ingredient_name}" unless ingredient and ingredient.recipe
  #  ingredient.recipe.ingredient_quantities.each do |ing_qty|
  #    new_ing_qty = ing_qty.dup
  #    new_ing_qty.recipe = @current_recipe
  #    new_ing_qty.save!
  #  end
  #end
  #Class.new.extend(RecipeCommands).ajouter
  def ajouter(quantity, unit_or_ingredient_name, ingredient_name=nil)
    ingQty = parseIngredientQuantity(quantity, unit_or_ingredient_name, ingredient_name)
    @current_recipe.ingredient_quantities << ingQty
    ingQty.save!
    if ingQty.ingredient.is_external
      c = "insert_jar #{ingQty.weight}, #{ingQty.ingredient.name}"
      @steps.unshift Step.new(action_required: true, command: c)
    end
  end
  alias verser ajouter
  def use(real_object_name) # prendre
    real_object = RealObject.find_by(name: real_object_name)
    raise "Error prendre. Unkown object #{real_object_name}" unless real_object
  end
end

class RecipeProcessor
  include RecipeCommands
  include Utils

  def process(recipe)
    @current_recipe = recipe
    recipe.ingredient_quantities.destroy_all
    recipe.steps.destroy_all
    recipe.sub_commands.destroy_all
    @steps = []
    brain = Brain.new
    brain.paused = false
    brain.simulation_speed = 9999999999.0
    raw_commands = parse_instructions(brain.heda, recipe.instructions)
    raw_commands.each do |c|
      if module_has_command?(RecipeCommands, c)
        execute_command(RecipeCommands, c)
      end
      translation = Translation.find_by(translated: c.command.to_s)
      if translation
        @steps << Step.new(command: "#{translation.english} #{c.args.join(', ')}")
      else
        @steps << Step.new(command: c.to_s)
      end
    end
    @steps.each_with_index {|s, i| s.nb = i; s.seconds = 0.0 }
    recipe.steps << @steps

    brain.reset
    brain.seed_recipe(recipe)
    recipe.steps.each do |step|
      brain.body.total_time = 0.0
      c = parse_instruction(brain.heda, step.command)
      brain.execute_recipe_command(c)
      s = brain.body.total_time
      puts "Step #{step.nb}".green + " takes #{s}s (#{step.command})"
      step.update!(seconds: s)
    end
    $subcommands[1..-1].each_with_index do |sub, i|
      sub.parent = sub.find_parent($subcommands[i])
    end
    recipe.sub_commands << $subcommands
  end
end

