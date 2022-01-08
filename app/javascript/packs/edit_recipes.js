import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

//import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
//import Autosuggest from 'react-autosuggest'
//
//import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'
//
//import Quantity from 'models/quantity'
//import { Ingredient, Utils } from "recipe_utils"
//
//import { DeleteConfirmButton } from 'components/delete_confirm_button'
//
import { useEditor, EditorContent, BubbleMenu, ReactNodeViewRenderer, NodeViewWrapper, generateJSON, generateHTML } from '@tiptap/react'
import { Tiptap, BubbleTiptap, ModificationsHandler, recipeEditor, RecipeExtensions, ArticleExtensions, BubbleExtensions } from 'tiptap'
import '../styles/prose_mirror.scss'
//
//import {TextField, CollectionSelect} from '../form'


const EditRecipes = () => {

  const recipe = gon.recipes[0]
  gon.recipe = recipe

  // TODO: recipe.json, recipe.html
  const editor = useEditor(recipeEditor(recipe.text))
  //if (editor) {
  //  editor.on('create', ({ editor }) => {
  //    console.log('editor create')
  //    console.log('html', editor.getHTML())
  //    console.log('json', JSON.stringify(editor.getJSON()))
  //    console.log('html', editor.getHTML().length)
  //    console.log('json', JSON.stringify(editor.getJSON()).length)
  //  })
  //}

  const setJSONForRecipeNotes = () => {
    for (let i = 0; i < gon.recipes.length; i++) {
      let r0 = gon.recipes[i]
      gon.recipe = r0
      if (!r0.notes_array) {continue}
      for (let j = 0; j < r0.notes_array.length; j++) {
        let r = r0.notes_array[j]
        if (r.content == null || r.content == '') {
          console.log('skipping empty recipe note')
          continue 
        }
        let data = new FormData()
        let json = generateJSON(r.content, BubbleExtensions)
        data.append("recipe_note[json]", JSON.stringify(json))
        console.log("json", json)
        console.log("RecipeExtensions", BubbleExtensions)
        data.append("recipe_note[html]", generateHTML(json, BubbleExtensions))
        Rails.ajax({url: r.url, type: 'PATCH', data: data, success: () => {
          console.log('Update recipe note (id='+r.id+') JSON success.')
        }, error: (errors) => {
          toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
        }})
      }
    }
  }
  const setJSONForRecipeIngredients = () => {
    for (let i = 0; i < gon.recipes.length; i++) {
      let r = gon.recipes[i]
      gon.recipe = r
      if (r.text == null || r.text == '') {
        console.log('skipping empty recipe')
        continue 
      }
      let data = new FormData()
      let json = generateJSON(r.text, RecipeExtensions)
      data.append("recipe[json]", JSON.stringify(json))
      console.log("json", json)
      console.log("RecipeExtensions", RecipeExtensions)
      data.append("recipe[html]", generateHTML(json, RecipeExtensions))
      Rails.ajax({url: r.url, type: 'PATCH', data: data, success: () => {
        console.log('Update recipe (id='+r.id+') JSON success.')
      }, error: (errors) => {
        toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
      }})
    }
  }
  const setJSONForArticles = () => {
    for (let i = 0; i < gon.articles.length; i++) {
      let r = gon.articles[i]
      if (r.content == null || r.content == '') {
        console.log('skipping empty article')
        continue 
      }
      let data = new FormData()
      let json = generateJSON(r.content, ArticleExtensions)
      data.append("article[json]", JSON.stringify(json))
      data.append("article[html]", generateHTML(json, ArticleExtensions))
      Rails.ajax({url: r.url, type: 'PATCH', data: data, success: () => {
        console.log('Update article (id='+r.id+') JSON success.')
      }, error: (errors) => {
        toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
      }})
    }
  }
  const setJSONForRecipeKinds = () => {
    for (let i = 0; i < gon.recipes.length; i++) {
      let r = gon.recipes[i]
      gon.recipe = r
      if (r.text == null || r.text == '') {
        console.log('skipping empty recipe')
        continue 
      }
      let data = new FormData()
      let json = generateJSON(r.text, RecipeExtensions)
      data.append("recipe[json]", JSON.stringify(json))
      console.log("json", json)
      console.log("RecipeExtensions", RecipeExtensions)
      data.append("recipe[html]", generateHTML(json, RecipeExtensions))
      Rails.ajax({url: r.url, type: 'PATCH', data: data, success: () => {
        console.log('Update recipe (id='+r.id+') JSON success.')
      }, error: (errors) => {
        toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
      }})
    }
  }
  const setJSONForRecipes = () => {
    for (let i = 0; i < gon.recipes.length; i++) {
      let r = gon.recipes[i]
      gon.recipe = r
      if (r.text == null || r.text == '') {
        console.log('skipping empty recipe')
        continue 
      }
      let data = new FormData()
      let json = generateJSON(r.text, RecipeExtensions)
      data.append("recipe[json]", JSON.stringify(json))
      console.log("json", json)
      console.log("RecipeExtensions", RecipeExtensions)
      data.append("recipe[html]", generateHTML(json, RecipeExtensions))
      Rails.ajax({url: r.url, type: 'PATCH', data: data, success: () => {
        console.log('Update recipe (id='+r.id+') JSON success.')
      }, error: (errors) => {
        toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
      }})
    }
  }

  return (<>
    <h1>Edit recipes</h1>
    <div>
      <button className="btn btn-outline-primary" onClick={setJSONForRecipes}>RESET all recipes</button>
      <button className="btn btn-outline-primary" onClick={setJSONForArticles}>RESET all articles</button>
      <button className="btn btn-outline-primary" onClick={setJSONForRecipeIngredients}>RESET all recipe ingredients</button>
      <button className="btn btn-outline-primary" onClick={setJSONForRecipeNotes}>RESET all recipe notes</button>
      <button className="btn btn-outline-primary" onClick={setJSONForRecipeKinds}>RESET all recipe kinds</button>
      <button className="btn btn-outline-primary">Update all HTML</button>
    </div>
    <div>
      <EditorContent editor={editor} />
    </div>
  </>)
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root')
  if (root) {ReactDOM.render(<EditRecipes />, root)}
})
