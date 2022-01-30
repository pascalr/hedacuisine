class MenusController < ApplicationController
  before_action :set_menu, only: [:edit, :update, :destroy]
  skip_before_action :authenticate_user!, only: [:index, :show]
  skip_before_action :only_admin!

  def index
    #@menus = User.first.menus # FIXME: Temporary TODO: Use User.heda.menus
    #@menus = @menus.to_a - current_user.favorite_menus.to_a if current_user
  end

  def show
    @menu = Menu.find(params[:id])
    #args = {record_type: "Recipe", name: "source_image", record_id: @menu.recipes.map(&:id)}
    #@attachment = ActiveStorage::Attachment.where(args).first
    #@recipe = Recipe.find(@attachment.record_id) if @attachment
  end

  def new
    @menu = Menu.new
  end

  def edit
    #@description = @menu.descriptions.find_by locale: 
    @category = Category.new
    @recipes = Recipe.order(:name).all # OPTIMIZE: I only need the name. No need to load everything.
  end

  def add_or_create_recipe
    category = Category.find params[:category_id]
    recipe = current_user.recipes.find_by id: params[:recipe_id]
    ActiveRecord::Base.transaction do
      recipe = Recipe.create!(name: params[:recipe_name], source: params[:source], user: current_user) unless recipe
      Item.create!(category: category, menu: category.menu, recipe: recipe)
    end
    redirect_to edit_menu_path(category.menu)
  end

  def create
    @menu = Menu.new(menu_params)
    @menu.user = current_user

    respond_to do |format|
      if @menu.save
        format.html { redirect_to edit_menu_path(@menu), notice: 'Menu was successfully created.' }
        format.json { render :show, status: :created, location: @menu }
      else
        format.html { render :new }
        format.json { render json: @menu.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @menu.update(menu_params)
        format.html { redirect_to edit_menu_path(@menu), notice: 'Menu was successfully updated.' }
        format.json { render :show, status: :ok, location: @menu }
      else
        format.html { render :edit }
        format.json { render json: @menu.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @menu.destroy
    respond_to do |format|
      format.html { redirect_to menus_url, notice: 'Menu was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_menu
      @menu = current_user.menus.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def menu_params
      params.require(:menu).permit(:name, :section_id, :is_cookable, :parent_id, :listing_id, :emoji)
    end
end
