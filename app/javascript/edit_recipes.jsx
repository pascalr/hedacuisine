import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

//import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
//import Autosuggest from 'react-autosuggest'
//
//import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'
//
//import Quantity from 'models/quantity'
//
//import { DeleteConfirmButton } from 'components/delete_confirm_button'
//
import { useEditor, EditorContent, BubbleMenu, ReactNodeViewRenderer, NodeViewWrapper, generateJSON, generateHTML } from '@tiptap/react'
import { Tiptap, BubbleTiptap, ModificationsHandler, recipeEditor, RecipeExtensions, ArticleExtensions, BubbleExtensions, DescriptionExtensions } from './tiptap'
//
//import {TextField, CollectionSelect} from '../form'

const updateHTML = (record, model_name, json_field, html_field, extensions) => {
  if (record[json_field] == null || record[json_field] == '') {
    console.log('skipping empty '+model_name)
    return
  }
  let data = new FormData()
  data.append(model_name+"["+html_field+"]", generateHTML(JSON.parse(record[json_field]), extensions))
  Rails.ajax({url: record.url, type: 'PATCH', data: data, success: () => {
    console.log('Update ' + model_name + ' (id='+record.id+') JSON success.')
  }, error: (errors) => {
    toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
  }})
}

const EditRecipes = () => {

  const updateHTMLForRecipeNotes = () => {
    for (let i = 0; i < gon.recipes.length; i++) {
      let r0 = gon.recipes[i]
      gon.recipe = r0
      if (!r0.notes_array) {continue}
      for (let j = 0; j < r0.notes_array.length; j++) {
        let r = r0.notes_array[j]
        updateHTML(r, 'recipe_note', 'json', 'html', BubbleExtensions)
      }
    }
  }
  const updateHTMLForRecipeIngredients = () => {
    for (let i = 0; i < gon.recipes.length; i++) {
      let r0 = gon.recipes[i]
      gon.recipe = r0
      if (!r0.ingredients_array) {continue}
      for (let j = 0; j < r0.ingredients_array.length; j++) {
        let r = r0.ingredients_array[j]
        updateHTML(r, 'recipe_ingredient', 'comment_json', 'comment_html', BubbleExtensions)
      }
    }
  }
  const updateHTMLForArticles = () => {
    for (let i = 0; i < gon.articles.length; i++) {
      let r = gon.articles[i]
      updateHTML(r, 'article', 'json', 'html', ArticleExtensions)
    }
  }
  const updateHTMLForRecipeKinds = () => {
    for (let i = 0; i < gon.recipes.length; i++) {
      let r = gon.recipe_kinds[i]
      updateHTML(r, 'recipe_kind', 'description_json', 'description_html', DescriptionExtensions)
    }
  }
  const updateHTMLForRecipes = () => {
    for (let i = 0; i < gon.recipes.length; i++) {
      let r = gon.recipes[i]
      gon.recipe = r
      updateHTML(r, 'recipe', 'json', 'html', RecipeExtensions)
    }
  }

  return (<>
    <h1>Edit recipes</h1>
    <h2>Tout devrait théoriquement fontionner, mais je n'ai rien testé. Tester en dev avant prod.</h2>
    <div>
      <button className="btn btn-outline-primary" onClick={updateHTMLForRecipes}>UPDATE all recipes</button>
      <button className="btn btn-outline-primary" onClick={updateHTMLForArticles}>UPDATE all articles</button>
      <button className="btn btn-outline-primary" onClick={updateHTMLForRecipeIngredients}>UPDATE all recipe ingredients</button>
      <button className="btn btn-outline-primary" onClick={updateHTMLForRecipeNotes}>UPDATE all recipe notes</button>
      <button className="btn btn-outline-primary" onClick={updateHTMLForRecipeKinds}>UPDATE all recipe kinds</button>
    </div>
  </>)
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root')
  if (root) {ReactDOM.render(<EditRecipes />, root)}
})
