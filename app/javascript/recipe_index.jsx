import React, { useState, useEffect, useRef } from 'react'

import {PercentageCompleted} from './helpers/recipes_helper'
import { ajax, isBlank, normalizeSearchText } from "./utils"
import { recipe_path, favorite_recipe_path, favorite_recipes_path, image_variant_path } from "./routes"
import {EditUserRecipeModal} from './modals/edit_user_recipe'
import { DeleteConfirmButton } from './components/delete_confirm_button'
import { LinkToPage } from "./lib"

let recipeForItem = (item, recipes) => {
  if (item.class_name == "recipe") {return item;}
  return {id: item.recipe_id, name: item.name, image_used_id: item.image_used_id}
}

const RecipeList = ({page, list, original, selected, suggestions, tags, editUserRecipe, updateFavoriteRecipe, mixes, recipes}) => {

  let removeItem = (item) => {
    if (item.class_name == "favorite_recipe") { // Delete recipes is not supported here
      ajax({url: favorite_recipe_path(item), type: 'DELETE', success: () => {
        original.update(original.filter(f => f.id != item.id))
      }})
    }
  }

  //{!showPercentCompleted ? '' : <span>&nbsp;(<PercentageCompleted recipe={recipe}/>)</span>}
  return (<>
    <ul id="recipes" className="recipe-list">
      {list.map((item, current) => {
        let recipe = recipeForItem(item, recipes)
        let recipeTags = suggestions.filter(suggestion => suggestion.recipe_id == recipe.id).map(suggestion => tags.find(t => t.id == suggestion.filter_id))
        let mix = mixes.find(e => e.recipe_id == recipe.id)

        let toCook = <button type="button" className="dropdown-item" onClick={() => updateFavoriteRecipe(item, 1)}>À cuisiner</button>
        let toTry = <button type="button" className="dropdown-item" onClick={() => updateFavoriteRecipe(item, 2)}>À essayer</button>
        let toNotCook = <button type="button" className="dropdown-item" onClick={() => updateFavoriteRecipe(item, 0)}>Ne plus cuisiner</button>
        let toNotTry = <button type="button" className="dropdown-item" onClick={() => updateFavoriteRecipe(item, 0)}>Ne plus essayer</button>
        return (
          <li key={recipe.id} className='d-flex'>
            <span>
              <img src={recipe.image_used_id ? image_variant_path({id: recipe.image_used_id}, "thumb") : "/default_recipe_01_thumb.png"} width="71" height="48" style={{marginRight: '0.5em'}} />
              <LinkToPage page={{...page, page: 15, recipeId: recipe.id}} style={{color: 'black', fontSize: '1.1em'}} className={current == selected ? "selected" : undefined}>{recipe.name}</LinkToPage>
              {mix ? <img src="logo_001.svg" width="24" height="24"/> : ''}
              <span style={{color: 'gray', fontSize: '0.78em'}}>{recipeTags.map(tag => ` #${tag.name}`)} </span>
            </span>
            <span className="flex-grow-1"/>
            <span className="dropdown m-auto">
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
        )
      })}
    </ul>
  </>)
}

export const RecipeIndex = ({page, favoriteRecipes, suggestions, tags, mixes, recipes}) => {
  
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

  let ids = favoriteRecipes.map(f => f.recipe_id)
  let filteredUserRecipes = filterList(recipes.filter(r => !ids.includes(r.id)))
  let toCookList = filterList(favoriteRecipes.filter(r => r.list_id == 1))
  let toTryList = filterList(favoriteRecipes.filter(r => r.list_id == 2))
  let otherList = filterList(favoriteRecipes.filter(r => !r.list_id || r.list_id >= 3))
  let all = [...recipes, ...toCookList, ...toTryList, ...otherList]

  let select = (pos) => {
    setSelected(pos)
    inputField.current.value = pos < 0 ? '' : all[pos].name
  }

  let onKeyDown = ({key}) => {
    if (key == "ArrowDown") {select(selected >= all.length-1 ? -1 : selected+1)}
    if (key == "ArrowUp") {select(selected < 0 ? all.length-1 : selected-1)}
    if (key == "Enter") {window.location.href = recipe_path(recipeForItem(all[selected]))}
  }
  
  let updateFavoriteRecipe = (item, list_id) =>{
    if (item.class_name == "favorite_recipe") {
      ajax({url: favorite_recipe_path(item), type: 'PATCH', data: {favorite_recipe: {list_id}}, success: (updated) => {
        favoriteRecipes.update(favoriteRecipes.map(f => f.id == item.id ? updated : f))
      }, error: () => {
      }})
    } else if (item.class_name == "recipe") {
      ajax({url: favorite_recipes_path(), type: 'POST', data: {favorite_recipe: {list_id, recipe_id: item.id}}, success: (created) => {
        favoriteRecipes.update([...favoriteRecipes, created])
      }, error: () => {
      }})
    }
  }

  let editUserRecipe = (recipe) => {
    setRecipeToEdit(recipe)
    setShowModal(true)
  }

  let listArgs = {page, selected, suggestions, tags, editUserRecipe, updateFavoriteRecipe, mixes, recipes}

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
    <RecipeList original={recipes} list={filteredUserRecipes} {...listArgs} />
    <h3>Mes recettes favorites</h3>
    <RecipeList original={favoriteRecipes} list={otherList} {...listArgs} />
  </>)
}
