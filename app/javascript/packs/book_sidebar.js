import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import autocomplete from 'external/js-autocomplete/auto-complete';
import 'external/js-autocomplete/auto-complete.css';
//import autocomplete from 'js-autocomplete';

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
  
  const collapseElem = useRef(null);
  const inputField = useRef(null);
  
  useEffect(() => {
    const doFocus = () => {
      inputField.current.focus()
      var autoComplete = new autocomplete({
        selector: inputField.current,
        menuClass: "book-search-suggestions",
        minChars: 0,
        source: function(term, suggest){
          term = normalizeSearchText(term)
          const matches = [];
          gon.book_sections.forEach(book_section => {
            let recipes = gon.recipes_by_section[book_section.id].filter(r => (
              r.recipe.name && ~normalizeSearchText(r.recipe.name).indexOf(term)
            ))
            if (!isBlank(recipes)) {
              matches.push({section: book_section, recipe: recipes[0]})
              recipes.slice(1).forEach(recipe => matches.push({recipe}))
            }
          })
          suggest(matches);
        },
        renderItem: function ({section, recipe}, search){
          search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
          let r = ""
          if (section) {r += `<h3>${section.name}</h3>`}
          return r+'<a class="autocomplete-suggestion" data-val="'+recipe.recipe.name+'" href="'+recipe.url+'"><b>' + recipe.recipe.name + '</b></a>'
        },
        onSelect: function(e, term, item){
          window.location.href = item.href
        }
      })
      inputField.current.showEmptyAutocomplete()
    }
    collapseElem.current.addEventListener("shown.bs.collapse", doFocus)
    return () => {
      collapseElem.current.removeEventListener("", doFocus)
      autoComplete.destroy()
    }
  }, []);
  
  return (<>
    <div id="search-book" ref={collapseElem} className="collapse collapse-horizontal" style={{border: "1px solid black", padding: "0.5em", height: "100%"}}>
      <div style={{width: "300px", height: "100%"}}>
        <input id="book-filter" type="search" placeholder="Filtrer..." ref={inputField} autoComplete="off" style={{width: "100%"}}/>
      </div>
    </div>
  </>)
}

document.addEventListener('DOMContentLoaded', () => {

  const root = document.getElementById('book-sidebar')
  if (root) {ReactDOM.render(<BookSidebar/>, root)}
})
