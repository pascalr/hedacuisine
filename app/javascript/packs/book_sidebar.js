import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

//import { DeleteConfirmButton } from 'components/delete_confirm_button'
//
//import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
//import Autosuggest from 'react-autosuggest'
//
//import { ajax, sortBy } from "../utils"
//import { combineOrderedListWithHeaders } from '../lib'
//
//import { DescriptionTiptap, ModificationsHandler } from 'tiptap'
//
//import {UploadableImage} from '../modals/uploadable_image'
//
////
//import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'
////
////
////import Quantity from 'models/quantity'
////import { Ingredient, Utils } from "recipe_utils"

import {TextField} from '../form'

const BookSidebar = () => {

  return (<>
    <div id="search-book" className="collapse collapse-horizontal" style={{border: "1px solid black", padding: "0.5em"}}>
      <div style={{width: "300px"}}>
        {(gon.recipes_by_section[0]||[]).map(book_recipe => (
          <div key={book_recipe.id}>{book_recipe.recipe.name}</div>
        ))}
        {gon.book_sections.map(book_section => (
          <div key={`section-${book_section.id}`}>
            <h3>{book_section.name}</h3>
            {(gon.recipes_by_section[book_section.id]||[]).map(book_recipe => (
              <div key={book_recipe.id}>{book_recipe.recipe.name}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </>)
}

document.addEventListener('DOMContentLoaded', () => {

  const root = document.getElementById('book-sidebar')
  if (root) {ReactDOM.render(<BookSidebar/>, root)}
})
