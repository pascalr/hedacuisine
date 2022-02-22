json.pages @book.pages, :id, :page_nb

json.book_pages_path book_pages_path(@book)
json.book_book_recipes_path book_book_recipes_path(@book)
json.book_book_sections_path book_book_sections_path(@book)
json.on_index_change_book_path on_index_change_book_path(@book)

json.recipe_kinds RecipeKind.order(:name).includes(:recipes).where(recipes: {is_public: true}).map {|recipe_kind| {id: recipe_kind.id, name: recipe_kind.name.downcase}}
