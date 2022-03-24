import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { isBlank, normalizeSearchText } from "./utils"
import { recipe_path } from "./routes"

const RecipeIndex = () => {
  
  const inputField = useRef(null);
  const [search, setSearch] = useState('')

  useEffect(() => {
    //let elems = document.querySelectorAll('[data-book-search-toggle]')
    //for (let i = 0; i < elems.length; i++) {
    //  let elem = elems[i]
    //  elem.handleToggle = () => {setVisible(true); doInit()} // FIXME: This does not work: setVisible(!visible)
    //  elem.addEventListener("click", elem.handleToggle)
    //}
    //return () => {
    //  let elems = document.querySelectorAll('[data-book-search-toggle]')
    //  for (let i = 0; i < elems.length; i++) {
    //    elem.removeEventListener("click", elem.handleToggle)
    //  }
    //}
  }, []);
 
  //let term = normalizeSearchText(search)
  //let filtered = []
  //if (data) {
  //  // 0 means no section
  //  filtered = filtered.concat((data.recipes_by_section[0]||[]).filter(r => (
  //    r.recipe.name && ~normalizeSearchText(r.recipe.name).indexOf(term)
  //  )))
  //  data.book_sections.forEach((book_section) => {
  //    filtered = filtered.concat((data.recipes_by_section[book_section.id]||[]).filter(r => (
  //      r.recipe.name && ~normalizeSearchText(r.recipe.name).indexOf(term)
  //    )))
  //  })
  //}

  //let select = (pos) => {
  //  setSelected(pos)
  //  // TODO: Change the value of the input field, but not the search
  //}

  let onKeyDown = ({key}) => {
  //  if (key == "ArrowDown") {select(selected >= filtered.length-1 ? -1 : selected+1)}
  //  if (key == "ArrowUp") {select(selected < 0 ? filtered.length-1 : selected-1)}
  //  if (key == "Enter") {window.location.href = filtered[selected].url+"#main"}
  }

  let recipes = gon.recipes

  return (<>
    <div>
      <input id="book-filter" type="search" placeholder="Filtrer..." onChange={(e) => setSearch(e.target.value)} autoComplete="off" style={{width: "100%"}} onKeyDown={onKeyDown}/>
    </div>
    <ul id="recipes">
      {recipes.map((recipe, current) => {
        return (
          <li key={recipe.id}><a href={recipe_path(recipe)}>{recipe.name}</a></li>
        )
      })}
    </ul>
  </>)
}

document.addEventListener('DOMContentLoaded', () => {

  const root = document.getElementById('root')
  if (root) {ReactDOM.render(<RecipeIndex/>, root)}
})
