class SectionsController < ApplicationController
  before_action :set_section, only: [:update, :destroy, :move]

  def create
    section = Section.create!(section_params)
    redirect_back fallback_location: article_path(section.article)
  end

  def move
    @section.insert_at(params[:position].to_i)
    head :ok
  end

  def update
    @section.update!(section_params)
    redirect_back fallback_location: article_path(@section.article)
  end

  def destroy
    @section.destroy!
    redirect_back fallback_location: article_path(@section.article)
  end

  private

    def set_section
      @section = Section.find(params[:id] || params[:section_id])
    end

    def section_params
      params.require(:section).permit(:content, :title, :position, :article_id)
    end
end
