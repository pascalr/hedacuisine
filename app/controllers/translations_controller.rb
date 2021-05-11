class TranslationsController < ApplicationController

  before_action :set_translation, only: %i[ update destroy ]

  #skip_before_action :authenticate_user!, only: [:show]
  #skip_before_action :only_admin!, only: [:show]

  def index
    @languages = Language.all.order(:name)
    @translations = Translation.all

    @to_translate = Menu.all.map(&:name) + Recipe.all.map(&:name)
  end

  def create
    @translation = Translation.new(translation_params)

    respond_to do |format|
      if @translation.save
        format.html { redirect_to @translation, notice: "Listing was successfully created." }
        format.json { render :show, status: :created, location: @translation }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @translation.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @translation.update(translation_params)
        format.html { redirect_to @translation, notice: "Listing was successfully updated." }
        format.json { render :show, status: :ok, location: @translation }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @translation.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @translation.destroy
    respond_to do |format|
      format.html { redirect_to translations_url, notice: "Listing was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    def set_translation
      @translation = Translation.find(params[:id])
    end

    def translation_params
      params.require(:translation).permit(:from, :to, :original, :translated)
    end
end
