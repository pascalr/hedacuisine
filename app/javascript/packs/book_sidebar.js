import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import autocomplete from 'js-autocomplete';

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
        minChars: 0,
        source: function(term, suggest){
          term = normalizeSearchText(term)
          const matches = [];
          gon.book_sections.map(book_section => {
            let label = book_section.name
            if (label && ~normalizeSearchText(label).indexOf(term)) {
              matches.push(book_section)
            }
          })
          suggest(matches);
        },
        renderItem: function (item, search){
          search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
          if (item.class_name == "book_section") {
            return `<h3>${item.name}</h3>`
            //return '<a class="autocomplete-suggestion" href="'+item.url+'"><b>' + item.name + '</b></a>';
          }
        }//,
        //onSelect: function(e, term, item){
        //  TODO: Use the url from the href of the link
        //  window.location.href = choices[item.dataset.id].url
        //}
      })
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
