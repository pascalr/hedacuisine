class RecipeRatingsController < ApplicationController
  skip_before_action :only_admin!

  def create
    rating = (params[:rating].to_f * 2.0).round / 2.0
    r = current_user.recipe_ratings.find_by(recipe_id: params[:recipe_id])
    if r
      r.update!(rating: rating)
    else
      current_user.recipe_ratings.create!(rating: rating, recipe_id: params[:recipe_id])
    end
  end
  def destroy
    current_user.recipe_ratings.find_by(recipe_id: params[:recipe_id]).destroy!
  end
end
