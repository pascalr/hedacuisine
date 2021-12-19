json.book do
  json.class_name "book"
  json.id @book.id
  json.name @book.name
  json.author @book.author
end

json.theme do
  json.id @theme.id
  json.name @theme.name
  json.class_name "theme"
  json.url theme_path(@theme)
  json.background_color @theme.background_color
  json.text_color @theme.text_color
  json.page_separator_color @theme.page_separator_color
end

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
    json.html @recipes_html[book_recipe.recipe.id]
  end
end

json.recipe_kinds RecipeKind.order(:name).includes(:recipes).where(recipes: {is_public: true}).map {|recipe_kind| {id: recipe_kind.id, name: recipe_kind.name.downcase}}
