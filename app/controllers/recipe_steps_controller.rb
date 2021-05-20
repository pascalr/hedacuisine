class RecipeStepsController < ApplicationController
  #before_action :set_recipe_step, only: %i[ update destroy ]
  #skip_before_action :only_admin!
  #def parse_args(sentence)
  #  words = sentence.split(' ', 2)
  #  args = (words[1] || '').split(',').map(&:strip).map {|a| parse_arg(a)}
  #end

  def create
    #recipe = Recipe.find(params[:recipe_id])
    #food = Food.find(params[:food_id])
    #qty = params[:qty].split(',')
    #quantity = qty[0].to_i
    #unit = nil
    #unless qty[1].blank?
    #  unit = Unit.find_by(name: qty[1].strip) 
    #  raise "Invalid unit #{qty[1]}" unless unit
    #end
    #ing = RecipeStep.build(quantity, unit, food)
    #ing.recipe = recipe
    #ing.nb = recipe.last_recipe_step_number + 1
    #ing.save!
    #redirect_to edit_recipe_path(recipe)
  end

  def update
    #@recipe_step.update!(recipe_step_params)
    #redirect_to recipe_steps_path
  end

  def destroy
    #recipe_step = RecipeStep.find(params[:id])
    #recipe_step.destroy!
    #redirect_to edit_recipe_path(recipe_step.recipe)
  end

  private
    #def set_recipe_step
    #  @recipe_step = current_user.recipe_steps.find(params[:id])
    #end

    #def recipe_step_params
    #  params.require(:recipe_step).permit(:food_id, :preference, :availability, :container_format_id)
    #end
end
