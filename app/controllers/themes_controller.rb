class ThemesController < ApplicationController
  before_action :set_theme, only: %i[ show edit update destroy stylesheet ]

  def index
    @themes = Theme.all
  end

  #def show
  #end

  def new
    @theme = Theme.new
  end

  def stylesheet
    render partial: 'stylesheet', locals: {theme: @theme}, layout: false
  end

  def edit
    gon.jbuilder
  end

  def create
    @theme = Theme.new(theme_params)

    respond_to do |format|
      if @theme.save
        format.html { redirect_to edit_theme_path(@theme), notice: "Theme was successfully created." }
        format.json { render :show, status: :created, location: @theme }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @theme.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @theme.update(theme_params)
        format.html { redirect_to @theme, notice: "Theme was successfully updated." }
        format.json { render :show, status: :ok, location: @theme }
        format.js { head :ok }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @theme.errors, status: :unprocessable_entity }
        format.js { render json: @recipe.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @theme.destroy
    respond_to do |format|
      format.html { redirect_to themes_url, notice: "Theme was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    def set_theme
      @theme = Theme.find(params[:id])
    end

    def theme_params
      params.require(:theme).permit(:name, :background_color, :text_color, :font_name, :page_separator_color, :inverted_background_color, :inverted_text_color, :link_color)
    end
end
