class MixesController < ApplicationController

  before_action :set_mix, only: [:update, :destroy]
  #skip_before_action :authenticate_user!, only: [:test]
  #skip_before_action :only_admin!, only: [:test]
  #
  def create
    r = current_user.mixes.create!(mix_params)
    render json: r.to_obj
  end

  def update
    @mix.update!(mix_params)
    respond_to do |format|
      format.json {render json: @mix.to_obj}
    end
  end

  def destroy
    @mix.destroy!
    respond_to do |format|
      format.json {render json: {}}
    end
  end
private
    def set_mix
      @mix = current_user.mixes.find(params[:id])
    end
    def mix_params
      return {} if params[:mix].blank?
      params.require(:mix).permit(:name, :instructions, :recipe_id)
    end
end
