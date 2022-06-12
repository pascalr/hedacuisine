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

const printParams = (params) => {
  if (!params) {return ''}
  return '?' + new URLSearchParams(params).toString();
}

const getTranslatedRoute = (route,locale=null) => {
  if (!locale) {locale = getLocale()}
  if (route == "recipes") {
    if (locale == 'qc') {return 'recettes'}
  }
  if (route == "recipe_kinds") {
    if (locale == 'qc') {return 'catégories'}
  }
  if (route == "books") {
    if (locale == 'qc') {return 'livres'}
  }
  if (route == "my_books") {
    if (locale == 'qc') {return 'mes_livres'}
  }
  if (route == "new") {
    if (locale == 'qc') {return 'nouveau'}
  }
  throw "Can't get translated route"
}
const getTranslatedRouteWithLocale = (route) => {
  let locale = getLocale()
  return `${locale}/${getTranslatedRoute(route, locale)}`
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

export const mixes_path = (arg) => {
  return `/mixes`
}
export const mix_path = (arg) => {
  return `/mixes/${extractParamFromModel(arg)}`
}

export const create_new_recipe_book_path = (arg) => {
  return `/books/${extractParamFromModel(arg)}/create_new_recipe`
}

export const book_recipes_book_path = (arg) => {
  // FIXME: js paths should not be localized
  return `/qc/livres/${extractParamFromModel(arg)}/recettes`
}

export const update_tags_recipe_path = (arg) => {
  return `/recipes/${extractParamFromModel(arg)}/update_tags`
}

export const recipe_path = (arg, params={}) => {
  // FIXME: js paths should not be localized
  return `/${getTranslatedRouteWithLocale("recipes")}/${extractParamFromModel(arg)}${printParams(params)}`
}
export const inline_recipe_path = (arg, params={}) => {
  return `/${getTranslatedRouteWithLocale("recipes")}/${extractParamFromModel(arg)}/inline`
}
export const new_recipe_path = (arg) => {
  return `/${getTranslatedRouteWithLocale("recipes")}/${getTranslatedRoute("new")}`
}

export const new_book_path = (arg) => {
  return `/${getTranslatedRouteWithLocale("books")}/${getTranslatedRoute("new")}`
}

export const my_books_path = (arg) => {
  return `/${getTranslatedRouteWithLocale("my_books")}`
}

export const recipe_kind_path = (arg) => {
  // FIXME: js paths should not be localized
  return `/${getTranslatedRouteWithLocale("recipe_kinds")}/${extractParamFromModel(arg)}`
}

export const suggestions_path = (arg) => {
  return `/suggestions${appendParams(arg)}`
}

export const all_recipe_kinds_recipe_filters_path = (arg) => {
  return `/all_recipe_kinds${appendParams(arg)}`
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

export const user_books_books_path = (arg) => {
  return `/books/user_books`
}

export const favorite_recipe_path = (arg) => {
  return `/favorite_recipes/${extractParamFromModel(arg)}`
}
export const favorite_recipes_path = (arg) => {
  return `/favorite_recipes`
}

export const containers_path = (machine) => {
  return `/machines/${extractParamFromModel(machine)}/containers`
}
export const grocery_list_path = (machine) => {
  return `/machines/${extractParamFromModel(machine)}/grocery_list`
}
export const calendar_path = (machine) => {
  return `/machines/${extractParamFromModel(machine)}/meals`
}
export const inventory_path = (machine) => {
  return `/machines/${extractParamFromModel(machine)}/inventory`
}

export const user_tags_path = (arg) => {
  return `/user_tags`
}
export const user_tag_path = (arg) => {
  return `/user_tags/${extractParamFromModel(arg)}`
}
//export const send_training_data_suggestions_path = (arg) => {
//  return `/suggestions/send_training_data`
//}
//export const data_to_train_suggestions_path = (arg) => {
//  return `/suggestions/data_to_train${appendParams(arg)}`
//}
export const missing_filtered_recipes_path = (arg) => {
  return `/filtered_recipes/missing${appendParams(arg)}`
}
export const batch_create_filtered_recipes_path = (arg) => {
  return `/filtered_recipes/batch_create`
}
export const batch_destroy_filtered_recipes_path = (arg) => {
  return `/filtered_recipes/batch_destroy`
}
export const batch_update_filtered_recipes_path = (arg) => {
  return `/filtered_recipes/batch_update`
}

export const image_variant_path = (image, variant) => {
  if (!image || !variant) {return null}
  return `/images/${image.id ? image.id : image}/${variant}`
}
