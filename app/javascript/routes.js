const extractParamFromModel = (model) => {
  return model.id
}

export const paste_ingredients_recipes_path = (arg) => {
  return `/qc/recettes/${extractParamFromModel(arg)}/paste_ingredients`
}
