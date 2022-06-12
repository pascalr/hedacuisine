class Mix < ApplicationRecord
  belongs_to :user
  belongs_to :original_recipe, class_name: 'Recipe', optional: true # The recipe that this mix was cloned from.
  belongs_to :recipe, optional: true # The recipe to complete this mix into a meal.

  def to_obj(params={})
    extract_attributes(params, :name, :instructions, :recipe_id, :original_recipe_id)
  end
end
