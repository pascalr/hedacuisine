class IngredientsController < ApplicationController
  #before_action :set_ingredient, only: %i[ update destroy ]
  #skip_before_action :only_admin!
  #def parse_args(sentence)
  #  words = sentence.split(' ', 2)
  #  args = (words[1] || '').split(',').map(&:strip).map {|a| parse_arg(a)}
  #end

  def create
    raise "DEPRECATED. Use RecipeIngredients instead."
    recipe = Recipe.find(params[:recipe_id])
    food = Food.find(params[:food_id])
    qty = params[:qty].split(',')
    quantity = qty.blank? ? nil : qty[0].to_f
    unit = nil
    unless qty[1].blank?
      unit = Unit.find_by(name: qty[1].strip) 
      raise "Invalid unit #{qty[1]}" unless unit
    end
    ing = Ingredient.build(quantity, unit, food)
    ing.recipe = recipe
    ing.nb = recipe.last_ingredient_number + 1
    ing.save!
    redirect_to edit_recipe_path(recipe)
  end

  def update
    #@ingredient.update!(ingredient_params)
    #redirect_to ingredients_path
  end

  def destroy
    ingredient = Ingredient.find(params[:id])
    ingredient.destroy!
    redirect_to edit_recipe_path(ingredient.recipe)
  end

  private
    #def set_ingredient
    #  @ingredient = current_user.ingredients.find(params[:id])
    #end

    #def ingredient_params
    #  params.require(:ingredient).permit(:food_id, :preference, :availability, :container_format_id)
    #end
end
