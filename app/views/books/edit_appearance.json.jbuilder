json.book do
  json.class_name "book"
  json.url book_path(@book, format: :js)
  json.id @book.id
  json.name @book.name
  json.author @book.author
  json.theme_id @book.theme_id
  json.json @book.json
  json.html @book.html
  json.background_color @book.background_color
  json.front_page_text_color @book.front_page_text_color
  json.front_page_image_id @book.front_page_image_id
  json.page_aspect_ratio @book.page_aspect_ratio
  if @book.book_format
    json.partial! 'book_formats/book_format', book_format: @book.book_format
  end
  if @book.front_page_image
    json.front_page_image do
      json.id @book.front_page_image_id
      json.filename @book.front_page_image.filename
      json.url @application_controller.original_image_path(@book.front_page_image)
    end
  end
end

json.pages @book.pages, :id, :page_nb

json.book_pages_path book_pages_path(@book, format: :js)
json.book_book_recipes_path book_book_recipes_path(@book, format: :js)
json.book_book_sections_path book_book_sections_path(@book, format: :js)
json.on_index_change_book_path on_index_change_book_path(@book)

json.index_items @book.book_sections.map(&:order)+@book.book_recipes.map(&:order)

json.book_sections @book.book_sections do |book_section|
  json.id book_section.id
  json.class_name "book_section"
  json.position book_section.position
  json.name book_section.name
  json.url book_book_section_path(@book, book_section)
end

json.book_recipes @book.book_recipes do |book_recipe|
  json.id book_recipe.id
  json.class_name "book_recipe"
  json.position book_recipe.position
  json.url book_book_recipe_path(@book, book_recipe)
  json.recipe do
    json.id book_recipe.recipe.id
    json.name book_recipe.recipe.name
  end
end

json.recipe_kinds RecipeKind.order(:name).includes(:recipes).where(recipes: {is_public: true}).map {|recipe_kind| {id: recipe_kind.id, name: recipe_kind.name.downcase}}

json.book_formats BookFormat.all.order(:name) do |book_format|
  json.id book_format.id
  json.name book_format.name
end

json.user do
  json.name current_user.name
end
