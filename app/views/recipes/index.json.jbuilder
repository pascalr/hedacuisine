# json.array! @recipes, partial: "recipes/recipe", as: :recipe
json.array! @recipes do |recipe|
  json.name recipe.name
  json.url recipe_path(recipe)
  json.image thumb_image_path(recipe.image)
end
