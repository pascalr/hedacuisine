class AppController < ApplicationController
  def index
    gon.suggestions = current_user.suggestions.includes(:recipe).map {|s| o = s.to_obj_with_recipe_info}
    gon.current_user_admin = current_user_admin?
    gon.user_tags = current_user.user_tags.order(:position).map {|t| t.to_obj}
    gon.recipe_filters = RecipeFilter.where(user_id: nil).or(current_user.recipe_filters).map {|f| f.to_obj }
    gon.favorite_recipes = current_user.favorite_recipes.includes(:recipe).sort_by {|fav| fav.recipe.name}.map{|fav| fav.to_obj}
    gon.machines = current_user.machines.map {|m| m.to_obj}
    gon.containers = current_user.containers.map {|c| c.to_obj}
    gon.machine_foods = current_user.machine_foods.includes(:food).sort_by(&:name).map {|f| f.to_obj}
    gon.container_quantities = current_user.container_quantities.includes(:container_format).map {|c| c.to_obj}
    gon.mixes = current_user.mixes.map {|e| e.to_obj}
    gon.recipes = current_user.recipes.order(:name).map {|e| e.to_obj}
    gon.ingredient_sections = IngredientSection.where(recipe_id: gon.recipes.map{|e|e[:id]}).map {|e| e.to_obj}
    gon.recipe_kinds = RecipeKind.order(:name).map {|e| e.to_obj(only: [:name, :image_id])}
    gon.images = Image.where(id: gon.recipes.map{|e|e[:image_id]}+gon.recipe_kinds.map{|e|e[:image_id]}).map {|e| e.to_obj }
    #TODO: Tools
    #TODO: Ingredient
    gon.recipe_ingredients = RecipeIngredient.order(:item_nb).where(recipe_id: gon.recipes.map{|r|r[:id]}).map {|e| e.to_obj}
    gon.notes = RecipeNote.where(recipe_id: gon.recipes.map{|r|r[:id]}).map {|e| e.to_obj}
    gon.foods = Food.order(:name).all.map {|food| food.to_obj}
    gon.units = Unit.all.map {|unit| unit.to_obj}
    gon.contractionList = FrenchExpression.where(contract_preposition: true).map(&:singular)
    #gon.user_recipes = current_user.recipes.order(:name).map {|r| r.to_obj(only: :name)}
    #gon.favorite_recipes = current_user.favorite_recipes.includes(:recipe).sort_by {|fav| fav.recipe.name}.map {|fav| o = fav.recipe.to_obj(only: :name); o[:fav_id] = fav.id; o}
  end
end
