class RecipeStepsController < ApplicationController
  #before_action :set_recipe_step, only: %i[ update destroy ]
  #skip_before_action :only_admin!
  #def parse_args(sentence)
  #  words = sentence.split(' ', 2)
  #  args = (words[1] || '').split(',').map(&:strip).map {|a| parse_arg(a)}
  #end

  def create
    recipe = Recipe.find(params[:recipe_id])
    step = Step.find_by(id: params[:step_id])
    step ||= Step.create!(content: params[:recipe_step][:step_content])
    recipe_step = recipe.recipe_steps.create!(step: step)
    redirect_to edit_recipe_path(recipe_step.recipe)
  end

  def update
    #@recipe_step.update!(recipe_step_params)
    #redirect_to recipe_steps_path
  end

  def destroy
    recipe_step = RecipeStep.find(params[:id])
    recipe_step.destroy!
    redirect_to edit_recipe_path(recipe_step.recipe)
  end

  private
    #def set_recipe_step
    #  @recipe_step = current_user.recipe_steps.find(params[:id])
    #end

    def recipe_step_params
      params.require(:recipe_step).permit(:content)
    end
end
