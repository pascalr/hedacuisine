class UserTagsController < ApplicationController

  before_action :set_user_tag, only: [:update, :destroy]
  #skip_before_action :authenticate_user!, only: [:test]
  #skip_before_action :only_admin!, only: [:test]
  #
  def create
    if params[:tag_name]
      tag = RecipeFilter.create!(user_id: current_user_id, name: params[:tag_name])
      r = current_user.user_tags.create!(tag_id: tag.id)
      render json: {tag: tag.to_obj, userTag: r.to_obj}
    else 
      r = current_user.user_tags.create!(user_tag_params)
      render json: r.to_obj
    end
  end

  def update
    if params[:position]
      @user_tag.insert_at(params[:position].to_i)
    else
      @user_tag.update!(user_tag_params)
    end
    respond_to do |format|
      format.json {render json: @user_tag.to_obj}
    end
  end

  def destroy
    @user_tag.destroy!
    respond_to do |format|
      format.json {render json: {}}
    end
  end
private
    def set_user_tag
      @user_tag = current_user.user_tags.find(params[:id])
    end
    def user_tag_params
      return {} if params[:user_tag].blank?
      params.require(:user_tag).permit(:tag_id)
    end
end
