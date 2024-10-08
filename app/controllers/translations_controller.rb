class TranslationsController < ApplicationController

  before_action :set_translation, only: %i[ update destroy ]

  #skip_before_action :authenticate_user!, only: [:show]
  #skip_before_action :only_admin!, only: [:show]

  def index
    @translations = Translation.all

    @from = Language.default
    @to = Language.find_by(locale: 'en')
    @to_translate = MissingTranslation.all
  end

  def create
    missing = MissingTranslation.find(params[:missing_translation_id])
    @translation = Translation.new(translation_params)
    @translation.original.downcase!

    respond_to do |format|
      if @translation.save
        missing.destroy!
        format.html { redirect_to @translation, notice: "Translation was successfully created." }
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
        format.html { redirect_to @translation, notice: "Translation was successfully updated." }
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
      format.html { redirect_to translations_url, notice: "Translation was successfully destroyed." }
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
