json.pages @book.pages, :id, :page_nb

json.book_pages_path book_pages_path(@book)
json.book_book_recipes_path book_book_recipes_path(@book)
json.book_book_sections_path book_book_sections_path(@book)
json.on_index_change_book_path on_index_change_book_path(@book)

json.book_sections @book.book_sections do |book_section|
  json.id book_section.id
  json.class_name "book_section"
  json.before_recipe_at book_section.before_recipe_at
  json.name book_section.name
  json.url book_book_section_path(@book, book_section)
end

json.book_recipes @book.book_recipes.order(:position) do |book_recipe|
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
