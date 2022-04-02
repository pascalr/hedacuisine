import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Hammer from "react-hammerjs"

import { ajax } from "./utils"
import { suggestions_path, image_variant_path } from './routes'

const PAGE_CHOOSE_OCCASION = 1
const PAGE_CHOOSE_RECIPE = 2

const ChooseRecipe = () => {

  const [suggestions, setSuggestions] = useState(null)
  const [suggestionNb, setSuggestionNb] = useState(0)
 
  useEffect(() => {
    ajax({url: suggestions_path(), type: 'GET', success: (suggestions) => {
      setSuggestions(suggestions)
    }})
  }, [])

  const nextSuggestion = () => {
    // TODO: Load more suggestions
    // Stop when there are no more suggestions.
    setSuggestionNb(suggestionNb + 1)
  }
  
  let handleSwipe = ({direction}) => {
    if (direction == 2) { // left
      nextSuggestion()
    }
  }
 
  let suggestion = suggestions ? suggestions[suggestionNb] : null

  if (!suggestion) {return ''}
  return (<>
    <Hammer onSwipe={handleSwipe}>
      <div>
        <div className="over-container">
          <img src={image_variant_path(suggestion.image_id, "medium")} style={{maxWidth: "100vw"}} width="452" height="304" />
          <h2 className="bottom-center font-satisfy" style={{borderRadius: "0.5em", border: "1px solid #777", color: "#333", bottom: "1em", backgroundColor: "#f5f5f5", fontSize: "2em", padding: "0.2em 0.8em 0 0.2em"}}>{suggestion.name}</h2>
        </div>
        <div id="choose-btns" className="d-flex flex-column">
          <button type="button" className="btn btn-primary">Oui!</button>
          <button type="button" className="btn btn-danger" onClick={() => nextSuggestion()}>Non, pas cette fois</button>
        </div>
      </div>
    </Hammer>
  </>)
}

const ChooseOccasion = ({changePage}) => {
  // Pour recevoir des invités => (page suivantes, quelles restrictions => véganes)
  return (<>
    <h2 style={{textAlign: "center"}}>Pour quelle occasion cuisiner?</h2>
    <div id="occasions-btns" className="d-flex flex-column">
      <button type="button" className="btn btn-primary" onClick={() => changePage(PAGE_CHOOSE_RECIPE)}>Repas pour toute la semaine</button>
      <button type="button" className="btn btn-primary">Recette rapide de semaine</button>
      <button type="button" className="btn btn-primary">Recevoir des invités</button>
      <button type="button" className="btn btn-primary">Apporter à un potluck</button>
      <button type="button" className="btn btn-primary">Emporter un repas pour la journée</button>
      <button type="button" className="btn btn-primary">Un ingrédient près d'être périmé</button>
      <button type="button" className="btn btn-primary">Se gâter</button>
    </div>
  </>)
}

const WhatToEat = () => {

  const [currentPage, setCurrentPage] = useState(1)

  const pages = {
    1: <ChooseOccasion changePage={setCurrentPage} />,
    2: <ChooseRecipe changePage={setCurrentPage} />
  }

  // Pour recevoir des invités => (page suivantes, quelles restrictions => véganes)
  return (<>
    {pages[currentPage]}
  </>)
}

document.addEventListener('DOMContentLoaded', () => {

  const root = document.getElementById('what-to-eat')
  if (root) {ReactDOM.render(<WhatToEat/>, root)}
})
