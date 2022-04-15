class SearchController < ApplicationController
  skip_before_action :authenticate_account!
  skip_before_action :only_admin!
  def index
    @foods= Food.where("lower(name) like ? OR lower(plural) like ?", "%#{params[:search]}%", "%#{params[:search]}%")
    @recipes = Recipe.where("lower(name) like ?", "%#{params[:search]}%")
    @results = @recipes + @foods
  end
  def data
    respond_to do |format|
      format.json {
        @items = []
        recipe_kinds = RecipeKind.with_image(:image).order(:name)
        books = Book.all_public.with_image(:front_page_image).includes(:user).order(:name)
        if current_user
          @items += books.select {|b| b.user_id == current_user_id}
          recipes = current_user.recipes.with_image(:recipe_image).includes(recipe_kind: {image: {original_attachment: :blob}}).order(:name)
          @items += recipes
          kinds = recipes.map(&:recipe_kind_id)
          recipe_kinds = recipe_kinds.reject {|r| kinds.include?(r.id) }
          @items += recipe_kinds
          @items += books.reject {|b| b.user_id == current_user_id}
        else
          @items += recipe_kinds
          @items += books
        end
        result = @items.map do |item|
          if item.is_a? Recipe
            #image = item.use_personalised_image ? item.recipe_image : (item.recipe_kind ? item.recipe_kind.image : nil)
            im = Image.exist?(item.image) ? thumb_image_path(item.image) : nil#'/default_recipe_01_thumb.png'
            {label: item.name, url: recipe_path(item), image: im}
          elsif item.is_a? RecipeKind
            im = Image.exist?(item.image) ? thumb_image_path(item.image) : nil#'/default_recipe_01_thumb.png'
            {recipe_count: item.public_recipe_count_str, label: item.name, url: recipe_kind_path(item), image: im}
          elsif item.is_a? Book
            im = Image.exist?(item.front_page_image) ? portrait_thumb_image_path(item.front_page_image) : nil#'/books/default01.jpg'
            {label: item.name, url: book_path(item), image: im, author: item.author}
          end
        end
        render json: result
      }
    end
  end
end
