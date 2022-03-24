import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { isBlank, normalizeSearchText } from "./utils"
import { recipe_path } from "./routes"

const RecipeIndex = () => {
  
  const inputField = useRef(null);
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(-1)

  //useEffect(() => {
  //  // inputField.current.focus() This would be nice for computers, but it's bad for mobile...
  //}, []);
 
  let recipes = []
  let term = normalizeSearchText(search)
  recipes = gon.recipes.filter(r => (
    r.name && ~normalizeSearchText(r.name).indexOf(term)
  ))

  let select = (pos) => {
    setSelected(pos)
    inputField.current.value = pos < 0 ? '' : recipes[pos].name
  }

  let onKeyDown = ({key}) => {
    if (key == "ArrowDown") {select(selected >= recipes.length-1 ? -1 : selected+1)}
    if (key == "ArrowUp") {select(selected < 0 ? recipes.length-1 : selected-1)}
    if (key == "Enter") {window.location.href = recipe_path(recipes[selected])}
  }

  return (<>
    <div>
      <input ref={inputField} type="search" placeholder="Filtrer..." onChange={(e) => setSearch(e.target.value)} autoComplete="off" style={{width: "100%"}} onKeyDown={onKeyDown}/>
    </div>
    <ul id="recipes">
      {recipes.map((recipe, current) => {
        return (
          <li key={recipe.id}><a href={recipe_path(recipe)} className={current == selected ? "selected" : undefined}>{recipe.name}</a></li>
        )
      })}
    </ul>
  </>)
}

document.addEventListener('DOMContentLoaded', () => {

  const root = document.getElementById('root')
  if (root) {ReactDOM.render(<RecipeIndex/>, root)}
})
