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

@recipes.each do |recipe|
  json.set! recipe.name do
    json.url recipe_path(recipe)
    json.image thumb_image_path(recipe.image)
  end
end
