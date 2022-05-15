import React, { useState, useEffect, useRef } from 'react'

import {PercentageCompleted} from './helpers/recipes_helper'
import { ajax, isBlank, normalizeSearchText } from "./utils"
import { recipe_path, favorite_recipe_path } from "./routes"
import {EditUserRecipeModal} from './modals/edit_user_recipe'
import { DeleteConfirmButton } from './components/delete_confirm_button'

let recipeForItem = (item) => {
  return item.class_name == "recipe" ? item : {id: item.recipe_id, name: item.name}
}

const RecipeList = ({list, original, selected, suggestions, tags, editUserRecipe, updateFavoriteRecipe}) => {

  let removeItem = (item) => {
    if (item.class_name == "favorite_recipe") { // Delete recipes is not supported here
      ajax({url: favorite_recipe_path(item), type: 'DELETE', success: () => {
        original.update(original.filter(f => f.id != item.id))
      }})
    }
  }

  //{!showPercentCompleted ? '' : <span>&nbsp;(<PercentageCompleted recipe={recipe}/>)</span>}
  return (<>
    <ul id="recipes" className="list-group">
      {list.map((item, current) => {
        let recipe = recipeForItem(item)
        let recipeTags = suggestions.filter(suggestion => suggestion.recipe_id == recipe.id).map(suggestion => tags.find(t => t.id == suggestion.filter_id))

        let toCook = <li><button type="button" className="dropdown-item" onClick={() => updateFavoriteRecipe(item, 1)}>À cuisiner</button></li>
        let toTry = <li><button type="button" className="dropdown-item" onClick={() => updateFavoriteRecipe(item, 2)}>À essayer</button></li>
        let toNotCook = <li><button type="button" className="dropdown-item" onClick={() => updateFavoriteRecipe(item, 0)}>Ne plus cuisiner</button></li>
        let toNotTry = <li><button type="button" className="dropdown-item" onClick={() => updateFavoriteRecipe(item, 0)}>Ne plus essayer</button></li>
        return (<span key={recipe.id}>
          <li className="list-group-item" key={recipe.id}>
            <a href={recipe_path(recipe)} className={current == selected ? "selected" : undefined}>{recipe.name}</a>
            <span style={{color: 'gray', fontSize: '0.78em'}}>{recipeTags.map(tag => ` #${tag.name}`)} </span>
            <span className="dropdown">
              <button className="plain-btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="icons/three-dots.svg"/>
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li>{item.list_id == 1 ? toNotCook : toCook }</li>
                <li>{item.list_id == 2 ? toNotTry : toTry }</li>
                <li><button type="button" className="dropdown-item" onClick={() => editUserRecipe(recipe)}>Modifier</button></li>
                <li>
                  <DeleteConfirmButton id={`remove-recipe-${recipe.id}`} onDeleteConfirm={() => removeItem(item)} message="Je veux enlever ce favori?">
                    <button type="button" className="dropdown-item">Retirer</button>
                  </DeleteConfirmButton>
                </li>
              </ul>
            </span>
          </li>
        </span>)
      })}
    </ul>
  </>)
}

export const RecipeIndex = ({userRecipes, favoriteRecipes, suggestions, tags}) => {
  
  const inputField = useRef(null);
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(-1)
  const [showModal, setShowModal] = useState(true)
  const [recipeToEdit, setRecipeToEdit] = useState(null)
 
  let term = normalizeSearchText(search)

  const filterList = (list) => {
    if (!list) {return []}
    return list.filter(r => (
      r.name && ~normalizeSearchText(r.name).indexOf(term)
    ))
  }

  let filteredUserRecipes = filterList(userRecipes)
  let toCookList = filterList(favoriteRecipes.filter(r => r.list_id == 1))
  let toTryList = filterList(favoriteRecipes.filter(r => r.list_id == 2))
  let otherList = filterList(favoriteRecipes.filter(r => !r.list_id || r.list_id >= 3))
  let all = [...userRecipes, ...toCookList, ...toTryList, ...otherList]

  let select = (pos) => {
    setSelected(pos)
    inputField.current.value = pos < 0 ? '' : all[pos].name
  }

  let onKeyDown = ({key}) => {
    if (key == "ArrowDown") {select(selected >= all.length-1 ? -1 : selected+1)}
    if (key == "ArrowUp") {select(selected < 0 ? all.length-1 : selected-1)}
    if (key == "Enter") {window.location.href = recipe_path(recipeForItem(all[selected]))}
  }
  
  let updateFavoriteRecipe = (fav, list_id) =>{
    ajax({url: favorite_recipe_path(fav), type: 'PATCH', data: {favorite_recipe: {list_id}}, success: (updated) => {
      favoriteRecipes.update(favoriteRecipes.map(f => f.id == fav.id ? updated : f))
    }, error: () => {
    }})
  }
  let createFavoriteRecipe = (fav) =>{
    ajax({url: favorite_recipe_path(recipe), type: 'PATCH', data: {}, success: () => {
    }, error: () => {
    }})
  }

  let editUserRecipe = (recipe) => {
    setRecipeToEdit(recipe)
    setShowModal(true)
  }

  let listArgs = {selected, suggestions, tags, editUserRecipe, updateFavoriteRecipe}

  return (<>
    <EditUserRecipeModal showModal={showModal} setShowModal={setShowModal} recipe={recipeToEdit} tags={tags} suggestions={suggestions} />
    <div>
      <input ref={inputField} type="search" placeholder="Filtrer..." onChange={(e) => setSearch(e.target.value)} autoComplete="off" style={{width: "100%"}} onKeyDown={onKeyDown}/>
    </div>
    <h3>À cuisinner prochainement</h3>
    <RecipeList original={favoriteRecipes} list={toCookList} {...listArgs} />
    <h3>À essayer</h3>
    <RecipeList original={favoriteRecipes} list={toTryList} {...listArgs} />
    <h3>Mes recettes personnelles</h3>
    <RecipeList original={userRecipes} list={filteredUserRecipes} {...listArgs} />
    <h3>Mes recettes favorites</h3>
    <RecipeList original={favoriteRecipes} list={otherList} {...listArgs} />
  </>)
}
