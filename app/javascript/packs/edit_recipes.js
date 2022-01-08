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
import { Tiptap, BubbleTiptap, ModificationsHandler, recipeEditor, RecipeExtensions } from 'tiptap'
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
      <button className="btn btn-outline-primary" onClick={setJSONForRecipes}>Update everything once</button>
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
