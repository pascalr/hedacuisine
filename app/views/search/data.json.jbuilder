json.array! @items do |item|
  if item.is_a? Recipe
    json.label item.name
    json.url recipe_path(item)
    json.image thumb_image_path(item.image)
  elsif item.is_a? RecipeKind
    json.recipe_count item.public_recipe_count_str
    json.label item.name
    json.url recipe_kind_path(item)
    json.image thumb_image_path(item.image)
  elsif item.is_a? Book
    json.label item.name
    json.url book_path(item)
    json.image portrait_thumb_image_path(item.front_page_image)
    json.author item.author
  end
end
