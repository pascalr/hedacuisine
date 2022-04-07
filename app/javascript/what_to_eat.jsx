import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Hammer from "react-hammerjs"

import { ajax, preloadImage } from "./utils"
import { icon_path, recipe_kind_path, suggestions_path, image_variant_path, send_data_suggestions_path } from './routes'
import {TextField} from './form'

const ChooseRecipe = () => {

  const [suggestions, setSuggestions] = useState([])
  const [suggestionNb, setSuggestionNb] = useState(0)
  const [maxSuggestionNb, setMaxSuggestionNb] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(null)
  const [page, setPage] = useState(1)
  const [doneFetching, setDoneFetching] = useState(false)
 
  useEffect(() => {
    ajax({url: suggestions_path({page}), type: 'GET', success: (suggests) => {
      if (itemsPerPage == null) {setItemsPerPage(suggests.length)}
      if (suggests == [] || suggests.length < itemsPerPage) {
        console.log('done fetching received ', suggests)
        setDoneFetching(true)
      }
      setSuggestions(suggestions.concat(suggests))
      for (let i = 0; i < suggests.length; i++) {
        if (suggests[i].image_id) {
          preloadImage(image_variant_path(suggests[i].image_id, "medium"))
        }
      }
    }})
  }, [page])

  const nextSuggestion = () => {
    if (suggestionNb < suggestions.length-1) {
      let nb = suggestionNb + 1
      setSuggestionNb(nb)
      if (nb > maxSuggestionNb) { setMaxSuggestionNb(nb) }
    }
    if (!doneFetching && suggestionNb >= suggestions.length - 2) {
      setPage(page+1)
    }
  }
  const previousSuggestion = () => {
    setSuggestionNb(suggestionNb <= 0 ? 0 : suggestionNb - 1)
  }

  let handleSwipe = ({direction}) => {
    if (direction == 2) { // left
      nextSuggestion()
    } else if (direction == 4) { // right
      previousSuggestion()
    }
  }
 
  let suggestion = suggestions ? suggestions[suggestionNb] : null
  if (!suggestion) {return ''}

  const encodeRecord = (record) => (`${record.class_name == "recipe_kind" ? '' : '_'}${record.id}`)
  const selectRecipe = () => {
    let skipped = []
    for (let i = 0; i < suggestionNb; i++) {
      skipped.push(encodeRecord(suggestions[i]))
    }
    for (let i = suggestionNb+1; i <= maxSuggestionNb; i++) {
      skipped.push(encodeRecord(suggestions[i]))
    }
    // send stats, which recipe was skipped, which was selected
    ajax({url: send_data_suggestions_path(), type: 'PATCH', data: {skipped, selected: encodeRecord(suggestion)}, success: (suggests) => {
      window.location = recipe_kind_path(suggestion)
    }, error: () => {
      window.location = recipe_kind_path(suggestion)
    }})
  }
  
  return (<>
    <Hammer onSwipe={handleSwipe}>
      <div>
        <div className="over-container" style={{margin: "auto"}}>
          <img src={suggestion.image_id ? image_variant_path(suggestion.image_id, "medium") : "/default_recipe_01.png"} style={{maxWidth: "100vw"}} width="452" height="304" />
          <h2 className="bottom-center font-satisfy" style={{borderRadius: "0.5em", border: "1px solid #777", color: "#333", bottom: "1em", backgroundColor: "#f5f5f5", fontSize: "2em", padding: "0.2em 0.8em 0 0.2em"}}>{suggestion.name}</h2>
          <div className="left-center">
            <img src={icon_path("custom-chevron-left.svg")} width="45" height="90" onClick={previousSuggestion} aria-disabled={suggestionNb <= 0} />
          </div>
          <div className="right-center">
            <img src={icon_path("custom-chevron-right.svg")} width="45" height="90" onClick={nextSuggestion} aria-disabled={doneFetching && suggestionNb >= suggestions.length-1} />
          </div>
        </div>
        <div id="choose-btns" className="d-flex flex-column">
          <button type="button" className="btn btn-primary" onClick={selectRecipe}>Oui!</button>
          <button type="button" className="btn btn-danger" onClick={() => nextSuggestion()}>Non, pas cette fois</button>
        </div>
      </div>
    </Hammer>
  </>)
}

const EditFilter = ({changePage}) => {
  const [name, setName] = useState('')
  return (<>
    <h2>Créer un nouveau filtre</h2>
    <h3>Titre</h3>
    <input type="text" value={name||''} name='recipe_filter[name]' onChange={(e) => setName(e.target.value)} />
    <h3>Image</h3>
  </>)
}

const ChooseOccasionButton = ({image, title, handleClick}) => {
  return (
    <button className="plain-btn d-flex p-1 flex-column align-items-center" onClick={handleClick}>
      <img src={`/img/${image}`} width="150" height="150" />
      <b>{title}</b>
    </button>
  )
}
const ChooseOccasion = ({recipeFilters, addRecipeFilter, changePage}) => {

  const createRecipeFilter = () => {
    ajax({url: recipe_filters_path(), type: 'POST', data: {}, success: (recipe_filter) => {
      addRecipeFilter(recipe_filter)
    }})
  }

  // Pour recevoir des invités => (page suivantes, quelles restrictions => véganes)
  return (<>
    <div className="d-flex flex-column flex-items-center" style={{maxWidth: "375px", margin: "auto"}}>
      <div className="d-flex">
        <ChooseOccasionButton image="quick-recipe.jpg" title="Recette rapide" handleClick={() => changePage(2)} />
        <div className="flex-grow-1"/>
        <ChooseOccasionButton image="three-meals.jpg" title="Plusieurs repas" handleClick={() => changePage(2)} />
      </div> 
      <div className="d-flex">
        <ChooseOccasionButton image="cheers-glasses.jpg" title="Recevoir des invités" handleClick={() => changePage(2)} />
        <div className="flex-grow-1"/>
        <ChooseOccasionButton image="table-food.jpg" title="Apporter à un potluck" handleClick={() => changePage(2)} />
      </div> 
      <div className="d-flex">
        <ChooseOccasionButton image="romantic-diner.jpg" title="Souper romantique" handleClick={() => changePage(2)} />
        <div className="flex-grow-1"/>
        <ChooseOccasionButton image="picnic.jpg" title="Picnic" handleClick={() => changePage(2)} />
      </div> 
      <div className="d-flex">
        <ChooseOccasionButton image="question-mark.jpg" title="Personnalisé" handleClick={() => createRecipeFilter()} />
        <div className="flex-grow-1"/>
        <div style={{width: "calc(150px + 1em)"}}/>
      </div> 
    </div>
  </>)
}

const WhatToEat = () => {

  const [currentPage, setCurrentPage] = useState(1)
  const [recipeFilters, setRecipeFilters] = useState([])
  
  useEffect(() => {
    if (gon.recipe_filters) { setRecipeFilters(gon.recipe_filters) }
  }, [])

  const parentPages = {
    2: 1,
    3: 1,
  }

  const pages = {
    1: <ChooseOccasion changePage={setCurrentPage} recipeFilters={recipeFilters} addRecipeFilter={(filter) => setRecipeFilters(recipeFilters.concat([filter]))} />,
    2: <ChooseRecipe changePage={setCurrentPage} />,
    3: <EditFilter changePage={setCurrentPage} />
  }

  const goBack = () => {
    if (parentPages[currentPage]) {
      setCurrentPage(parentPages[currentPage])
    } else {
      window.history.back()
    }
  }

  // Pour recevoir des invités => (page suivantes, quelles restrictions => véganes)
  return (<>
    <div className="d-flex">
      <img src={icon_path("arrow-left-square.svg")} width="24" style={{paddingLeft: "0.5em"}} onClick={goBack} />
      <div className="flex-grow-1"/>
      <h1 style={{marginBottom: "0"}}>Qu'est-ce qu'on mange?</h1>
      <div className="flex-grow-1"/>
    </div>
    <hr style={{color: "#aaa", marginTop: "0"}}/>
    {pages[currentPage]}
  </>)
}

document.addEventListener('DOMContentLoaded', () => {

  const root = document.getElementById('what-to-eat')
  if (root) {ReactDOM.render(<WhatToEat/>, root)}
})
