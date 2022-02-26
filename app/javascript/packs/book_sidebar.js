import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

//import { DeleteConfirmButton } from 'components/delete_confirm_button'
//
//import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
//import Autosuggest from 'react-autosuggest'
//
import { isBlank } from "../utils"
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

//import {TextField} from '../form'

import {normalizeSearchText} from '../utils'

const BookSidebar = () => {
  
  const [search, setSearch] = useState("")
  const inputField = useRef(null);
  const collapseElem = useRef(null);

  useEffect(() => {
    const doFocus = () => {inputField.current.focus()}
    collapseElem.current.addEventListener("shown.bs.collapse", doFocus)
    return () => {collapseElem.current.removeEventListener("", doFocus)}
  }, []);

  let recipes_by_section = {...gon.recipes_by_section}
  if (!!search) {
    let term = normalizeSearchText(search)
    let section_ids = Object.keys(recipes_by_section)
    section_ids.forEach(section_id => {
      recipes_by_section[section_id] = recipes_by_section[section_id].filter(r => (
        r.recipe.name && ~normalizeSearchText(r.recipe.name).indexOf(term)
      ))
    })
  }

  return (<>
    <div id="search-book" ref={collapseElem} className="collapse collapse-horizontal" style={{border: "1px solid black", padding: "0.5em"}}>
      <div style={{width: "300px"}}>
        <input type="search" value={search||''} placeholder="Filtrer..." ref={inputField} onChange={(e) => setSearch(e.target.value)} />
        {(recipes_by_section[0]||[]).map(book_recipe => (
          <div key={book_recipe.id}>{book_recipe.recipe.name}</div>
        ))}
        {gon.book_sections.map(book_section => (
          isBlank(recipes_by_section[book_section.id]) ? '' :
            <div key={`section-${book_section.id}`}>
              <h3>{book_section.name}</h3>
              {recipes_by_section[book_section.id].map(book_recipe => (
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
