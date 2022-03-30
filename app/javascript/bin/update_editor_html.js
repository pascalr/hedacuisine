import {foo} from '../nodejs_dependencies'

import { useEditor, EditorContent, BubbleMenu, ReactNodeViewRenderer, NodeViewWrapper, generateJSON, generateHTML } from '@tiptap/react'
import { Tiptap, BubbleTiptap, ModificationsHandler, recipeEditor, RecipeExtensions, ArticleExtensions, BubbleExtensions, DescriptionExtensions } from '../tiptap'

import { ajax } from '../utils'
import { get_editor_json_path } from '../routes'

ajax({url: get_editor_json_path({model: "recipe_kinds"}), type: 'GET', success: (data) => {
  console.log('DATA: %s', data)
}})

//const updateHTML = (record, model_name, json_field, html_field, extensions) => {
//  if (record[json_field] == null || record[json_field] == '') {
//    console.log('skipping empty '+model_name)
//    return
//  }
//  let data = new FormData()
//  data.append(model_name+"["+html_field+"]", generateHTML(JSON.parse(record[json_field]), extensions))
//  Rails.ajax({url: record.url, type: 'PATCH', data: data, success: () => {
//    console.log('Update ' + model_name + ' (id='+record.id+') JSON success.')
//  }, error: (errors) => {
//    toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
//  }})
//}
//
//const EditRecipes = () => {
//
//  const updateHTMLForRecipeNotes = () => {
//    for (let i = 0; i < gon.recipes.length; i++) {
//      let r0 = gon.recipes[i]
//      gon.recipe = r0
//      if (!r0.notes_array) {continue}
//      for (let j = 0; j < r0.notes_array.length; j++) {
//        let r = r0.notes_array[j]
//        updateHTML(r, 'recipe_note', 'json', 'html', BubbleExtensions)
//      }
//    }
//  }
//  const updateHTMLForRecipeIngredients = () => {
//    for (let i = 0; i < gon.recipes.length; i++) {
//      let r0 = gon.recipes[i]
//      gon.recipe = r0
//      if (!r0.ingredients_array) {continue}
//      for (let j = 0; j < r0.ingredients_array.length; j++) {
//        let r = r0.ingredients_array[j]
//        updateHTML(r, 'recipe_ingredient', 'comment_json', 'comment_html', BubbleExtensions)
//      }
//    }
//  }
//  const updateHTMLForArticles = () => {
//    for (let i = 0; i < gon.articles.length; i++) {
//      let r = gon.articles[i]
//      updateHTML(r, 'article', 'json', 'html', ArticleExtensions)
//    }
//  }
//  const updateHTMLForRecipeKinds = () => {
//    for (let i = 0; i < gon.recipes.length; i++) {
//      let r = gon.recipe_kinds[i]
//      updateHTML(r, 'recipe_kind', 'description_json', 'description_html', DescriptionExtensions)
//    }
//  }
//  const updateHTMLForRecipes = () => {
//    for (let i = 0; i < gon.recipes.length; i++) {
//      let r = gon.recipes[i]
//      gon.recipe = r
//      updateHTML(r, 'recipe', 'json', 'html', RecipeExtensions)
//    }
//  }
//
//}
