import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Hammer from "react-hammerjs"

import { ajax, preloadImage } from "./utils"
import { icon_path, recipe_kind_path, suggestions_path, image_variant_path, send_data_suggestions_path, recipe_filters_path, recipe_filter_path } from './routes'
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

const EditFilter = ({changePage, pageArgs}) => {
  const [name, setName] = useState('')
  const filter = pageArgs ? pageArgs.filter : null
  if (!filter) {console.log("Can't edit filter, did not exist."); return '';}

  //this.state.book.onServerUpdate = (book) => {
  //  this.setState({book: updateRecord(this.state.book, book, {image: {}})})
  //}

  const updateFilterField = (model, field, value) => {
    ajax({url: recipe_filter_path(model), type: 'PATCH', data: {[model.class_name+"["+field+"]"]: value}, success: (recipe_filter) => {
      console.log('TODO: Update filter name in js')
    }})
  }

  return (<>
    <h2>Modifier le filtre</h2>
    <h3>Titre</h3>
    <TextField model={filter} field="name" onUpdate={updateFilterField} />
    <h3>Image</h3>
  </>)
}

const EditConfig = ({recipeFilters, changePage}) => {

  const editFilters = recipeFilters.map(filter => (<div key={filter.id} onClick={() => changePage(3, {filter: filter})}>{filter.name || "Sans nom"}</div>))

  return (<>
    <h2>Paramètres des filtres</h2>
    {editFilters}
    <h2>Paramètres généraux</h2>
  </>)
}

const ChooseOccasionButton = ({winWidth, image, title, handleClick}) => {
  return (
    <div style={{width: `${Math.min(200, winWidth/2)}px`, padding: `${Math.min(25, (winWidth-300)/4)}px`, display: "inline-block"}}>
      <button className="plain-btn d-flex p-1 flex-column align-items-center" onClick={handleClick}>
        <img src={image} width="150" height="150" />
        <b>{title}</b>
      </button>
    </div>
  )
}
const ChooseOccasion = ({recipeFilters, addRecipeFilter, changePage}) => {

  const [winWidth, setWinWidth] = useState(window.innerWidth)
  useEffect(() => {
    const f = () => setWinWidth(window.innerWidth)
    window.addEventListener('resize', f)
    return () => {
      window.removeEventListener('resize', f)
    }
  }, [])

  const createRecipeFilter = () => {
    ajax({url: recipe_filters_path(), type: 'POST', data: {}, success: (recipe_filter) => {
      addRecipeFilter(recipe_filter)
      changePage(3, {filter: recipe_filter})
    }})
  }

  const buttons = recipeFilters.map(filter => <ChooseOccasionButton key={filter.id} winWidth={winWidth} image="question-mark.jpg" title={filter.name || "Sans nom"} handleClick={() => changePage(2, {filter: filter})} />)

  // Pour recevoir des invités => (page suivantes, quelles restrictions => véganes)
  return (<>
    <div style={{maxWidth: "100vw", width: "400px", margin: "auto"}}>
      <ChooseOccasionButton winWidth={winWidth} image="/img/quick-recipe.jpg" title="Recette rapide" handleClick={() => changePage(2)} />
      <ChooseOccasionButton winWidth={winWidth} image="/img/three-meals.jpg" title="Plusieurs repas" handleClick={() => changePage(2)} />
      <ChooseOccasionButton winWidth={winWidth} image="/img/cheers-glasses.jpg" title="Recevoir des invités" handleClick={() => changePage(2)} />
      <ChooseOccasionButton winWidth={winWidth} image="/img/table-food.jpg" title="Apporter à un potluck" handleClick={() => changePage(2)} />
      <ChooseOccasionButton winWidth={winWidth} image="/img/romantic-diner.jpg" title="Souper romantique" handleClick={() => changePage(2)} />
      <ChooseOccasionButton winWidth={winWidth} image="/img/picnic.jpg" title="Picnic" handleClick={() => changePage(2)} />
      {buttons}
      <ChooseOccasionButton winWidth={winWidth} image="/img/plus.jpg" title="Nouveau" handleClick={() => createRecipeFilter()} />
      <ChooseOccasionButton winWidth={winWidth} image="/icons/gear.svg" title="Paramètres" handleClick={() => changePage(4)} />
    </div>
  </>)
}

const WhatToEat = () => {

  const [currentPage, setCurrentPage] = useState(1)
  const [pageArgs, setPageArgs] = useState(null)
  const [recipeFilters, setRecipeFilters] = useState([])
  
  useEffect(() => {
    if (window.gon && gon.recipe_filters) { setRecipeFilters(gon.recipe_filters) }
  }, [])

  const parentPages = {
    2: 1,
    3: 1,
    4: 1,
  }

  const changePage = (pageNb, args=null) => {
    setCurrentPage(pageNb)
    setPageArgs(args)
  }

  const pages = {
    1: <ChooseOccasion changePage={changePage} recipeFilters={recipeFilters} addRecipeFilter={(filter) => setRecipeFilters(recipeFilters.concat([filter]))} />,
    2: <ChooseRecipe changePage={changePage} />,
    3: <EditFilter changePage={changePage} pageArgs={pageArgs} />,
    4: <EditConfig changePage={changePage} recipeFilters={recipeFilters} />
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
