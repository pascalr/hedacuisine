const extractParamFromModel = (model) => {
  return model.id
}

const appendParams = (arg) => {
  if (typeof arg == 'object') {
    let s = "?"
    Object.keys(arg).forEach(key => {s += key + "=" + arg[key] + "&"})
    return s.substr(0, s.length-1)
  }
  return ''
}

const getTranslatedRouteWithLocale = (route) => {
  let locale = getLocale()
  if (route == "recipes") {
    if (locale == 'qc') {return 'qc/recettes'}
  }
  if (route == "recipe_kinds") {
    if (locale == 'qc') {return 'qc/catégories'}
  }
  throw "Can't get translated route"
}

const getLocale = () => {
  return "qc"
}

export const icon_path = (arg) => {
  return `/icons/${arg}`
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

export const new_recipe_path = (arg) => {
  return `/${getTranslatedRouteWithLocale("recipes")}/new`
}

export const recipe_kind_path = (arg) => {
  // FIXME: js paths should not be localized
  return `/${getTranslatedRouteWithLocale("recipe_kinds")}/${extractParamFromModel(arg)}`
}

export const suggestions_path = (arg) => {
  return `/suggestions${appendParams(arg)}`
}

export const recipe_filters_path = (arg) => {
  return `/recipe_filters`
}
export const recipe_filter_path = (arg) => {
  return `/recipe_filters/${extractParamFromModel(arg)}`
}

export const public_images_path = (arg) => {
  return `/public_images`
}

export const send_data_suggestions_path = (arg) => {
  return `/suggestions/send_data`
}

export const user_recipes_recipes_path = (arg) => {
  return `/recipes/user_recipes`
}

export const send_training_data_suggestions_path = (arg) => {
  return `/suggestions/send_training_data`
}

export const data_to_train_suggestions_path = (arg) => {
  return `/suggestions/data_to_train${appendParams(arg)}`
}

export const image_variant_path = (image, variant) => {
  if (!image || !variant) {return null}
  return `/images/${image.id ? image.id : image}/${variant}`
}
