import React, { useState, useEffect, useRef } from 'react'

import {PercentageCompleted} from './helpers/recipes_helper'
import { isBlank, normalizeSearchText } from "./utils"
import { recipe_path } from "./routes"

export const RecipeIndex = ({userRecipes, favoriteRecipes, showPercentCompleted, loading, suggestions}) => {
  
  const inputField = useRef(null);
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(-1)

  //useEffect(() => {
  //  // inputField.current.focus() This would be nice for computers, but it's bad for mobile...
  //}, []);
 
  let recipes = []
  let term = normalizeSearchText(search)
  if (!userRecipes) {userRecipes = []}
  if (!favoriteRecipes) {favoriteRecipes = []}
  recipes = userRecipes.filter(r => (
    r.name && ~normalizeSearchText(r.name).indexOf(term)
  ))
  let nbUserRecipes = recipes.length
  recipes = recipes.concat(favoriteRecipes.filter(r => (
    r.name && ~normalizeSearchText(r.name).indexOf(term)
  )))

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
    <h3>Recettes personnelles</h3>
    {loading ? 'Loading...' : (
      <ul id="recipes" className="list-group">
        {recipes.map((recipe, current) => {
          let header = current == nbUserRecipes ? <h3 key={'hdr-'+current}>Recettes favorites</h3> : ''
          return (<span key={recipe.id}>
            {header}
            <li className="list-group-item" key={recipe.id}>
              <a href={recipe_path(recipe)} className={current == selected ? "selected" : undefined}>{recipe.name}</a>
              {!showPercentCompleted ? '' : <span>&nbsp;(<PercentageCompleted recipe={recipe}/>)</span>}
              <span style={{color: 'gray', fontSize: '0.78em'}}> #RecetteRapide #Végétarien </span>
              &nbsp;
              <button type="button" className="btn btn-outline-secondary" style={{fontSize: '0.8em', padding: '0em 0.2em 0em 0.2em'}}>Modifier</button>
              &nbsp;
              <button type="button" className="btn btn-outline-secondary" style={{fontSize: '0.8em', padding: '0em 0.2em 0em 0.2em'}}>Retirer</button>
            </li>
          </span>)
        })}
      </ul>)
    }
  </>)
}
