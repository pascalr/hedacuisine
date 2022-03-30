const extractParamFromModel = (model) => {
  return model.id
}

const getTranslatedRouteWithLocale = (route) => {
  let locale = getLocale()
  if (route == "recipes") {
    if (locale == 'qc') {return 'qc/recettes'}
  }
  throw "Can't get translated route"
}

const getLocale = () => {
  return "qc"
}

export const get_editor_json_path = (arg) => {
  return `/admin/get_editor_json/${arg.model}`
}

export const paste_ingredients_recipes_path = (arg) => {
  // FIXME: js paths should not be localized
  return `/qc/recettes/${extractParamFromModel(arg)}/paste_ingredients`
}

export const create_new_recipe_book_path = (arg) => {
  return `/books/${extractParamFromModel(arg)}/create_new_recipe`
}

export const book_recipes_book_path = (arg) => {
  // FIXME: js paths should not be localized
  return `/qc/livres/${extractParamFromModel(arg)}/recettes`
}

export const recipe_path = (arg) => {
  // FIXME: js paths should not be localized
  return `/${getTranslatedRouteWithLocale("recipes")}/${extractParamFromModel(arg)}`
}
