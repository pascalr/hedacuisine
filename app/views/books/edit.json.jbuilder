json.book do
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

json.recipes @book.recipes, :id, :name

json.recipe_kinds RecipeKind.order(:name).includes(:recipes).where(recipes: {is_public: true}).map {|recipe_kind| {id: recipe_kind.id, name: recipe_kind.name.downcase}}
