# json.array! @recipes, partial: "recipes/recipe", as: :recipe

#json.array! @recipes do |recipe|
#  json.name recipe.name
#  json.url recipe_path(recipe)
#  json.image thumb_image_path(recipe.image)
#end

#json.array! @recipes do |recipe|
#  json.name recipe.name
#  json.url recipe_path(recipe)
#  json.image thumb_image_path(recipe.image)
#end

#@items.each do |item|
#  json.set! item[:label] do
#    json.url item[:url]
#    json.image item[:image]
#  end
#end

json.array! @items do |item|
  if item.is_a? Recipe
    json.label item.name
    json.url recipe_path(item)
    json.image thumb_image_path(item.image)
  elsif item.is_a? RecipeKind
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
#if @recipes
#  json.array! @recipes, :label, :url, :image
#end
json.array! @books, :label, :url, :image, :author
