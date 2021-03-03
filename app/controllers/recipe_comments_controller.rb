class RecipeCommentsController < ApplicationController
  skip_before_action :only_admin!
  def create
    #@recipe_comment = RecipeComment.new(recipe_comment_params)
    #@recipe_comment.save!
    current_user.recipe_comments.create!(recipe_comment_params)
    redirect_to request.referrer
    # FIXME: CONTENT!!!
    #comment = current_user.recipe_comments.find_by(recipe_id: params[:recipe_id])
    #raise "Can't create recipe comment already exists" if comment
    #current_user.recipe_comments.create!(recipe_id: params[:recipe_id])
  end
  def destroy
    current_user.recipe_comments.find_by(recipe_id: params[:recipe_id]).destroy!
  end
  private
    def recipe_comment_params
      params.require(:recipe_comment).permit(:content, :recipe_id)
    end
end
