class AllowRecipeIngredientFoodIdNull < ActiveRecord::Migration[6.1]
  def change
    change_column_null :recipe_ingredients, :food_id, true
  end
end
