import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Hammer from "react-hammerjs"

import { ajax, preloadImage } from "./utils"
import { icon_path, recipe_kind_path, suggestions_path, image_variant_path, send_data_suggestions_path, send_training_data_suggestions_path, recipe_filters_path, recipe_filter_path, data_to_train_suggestions_path } from './routes'
import {TextField} from './form'
import {PublicImageField} from './modals/public_image'
import { DeleteConfirmButton } from './components/delete_confirm_button'
  
const encodeRecord = (record) => (`${record.class_name == "recipe_kind" ? '' : '_'}${record.id}`)

const ChooseRecipe = ({changePage, pageArgs, recipeFilters}) => {

  const [suggestions, setSuggestions] = useState([])
  const [suggestionNb, setSuggestionNb] = useState(0)
  const [maxSuggestionNb, setMaxSuggestionNb] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(null)
  const [page, setPage] = useState(1)
  const [doneFetching, setDoneFetching] = useState(false)

  const filter = pageArgs && pageArgs.filterId ? recipeFilters.find(f => f.id == pageArgs.filterId) : null
 
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
    {filter && filter.name ? <h2 style={{textAlign: 'center'}}>{filter.name}</h2> : ''}
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

const EditFilter = ({changePage, pageArgs, recipeFilters, setRecipeFilters}) => {
  const [name, setName] = useState('')
  const filter = pageArgs && pageArgs.filterId ? recipeFilters.find(f => f.id == pageArgs.filterId) : null
  if (!filter) {console.log("Can't edit filter, did not exist."); return '';}

  return (<>
    <h2>Modifier le filtre</h2>
    <h3>Titre</h3>
    <TextField model={filter} field="name" url={recipe_filter_path(filter)} getter={recipeFilters} setter={setRecipeFilters} />
    <h3>Image</h3>
    <PublicImageField model={filter} field="image_src" defaultSrc={"question-mark.jpg"} url={recipe_filter_path(filter)} getter={recipeFilters} setter={setRecipeFilters} />
    <br/>
    <div>
      <button type="button" className="btn btn-primary" onClick={() => changePage(5, {filterId: filter.id})}>Entraîner</button>
    </div>
  </>)
}

const TrainFilter = ({changePage, pageArgs, recipeFilters, setRecipeFilters}) => {

  const filter = pageArgs && pageArgs.filterId ? recipeFilters.find(f => f.id == pageArgs.filterId) : null
  if (!filter) {console.log("Can't train filter, did not exist."); return '';}
  
  const [dataToTrain, setDataToTrain] = useState([])
  const [selected, setSelected] = useState({})
  const [doneFetching, setDoneFetching] = useState(false)

  const fetchBatch = () => {
    ajax({url: data_to_train_suggestions_path(), type: 'GET', success: (data) => {
      if (!data || data == []) {
        console.log('done fetching received ', data)
        setDoneFetching(true)
      }
      setSelected({})
      setDataToTrain(data)
    }})
  }

  useEffect(() => {
    fetchBatch()
  }, [])

  const submitData = () => {
    let skipped = []
    let sel = []
    for (let i = 0; i < dataToTrain.length; i++) {
      if (selected[i]) {
        sel.push(encodeRecord(dataToTrain[i]))
      } else {
        skipped.push(encodeRecord(dataToTrain[i]))
      }
    }
    ajax({url: send_training_data_suggestions_path(), type: 'POST', data: {skipped, selected: sel}, success: () => {
      console.log('Fetching second batch of data')
      fetchBatch()
    }, error: (err) => {
      console.log('Error sending training data', err)
    }})
  }
              
  const imageClicked = (nb) => {
    let s = {...selected}
    s[nb] = !s[nb]
    setSelected(s)
  }

  if (!dataToTrain || dataToTrain.length <= 0) {return ''}

  return (<>
    <h2 style={{textAlign: 'center'}}>Quelle recette correspond à {filter.name} ?</h2>
    <table>
      <tbody>
        {[0,1,2,3,4].map(i => {
          return (<tr key={i}>
            {[0,1,2,3].map(j => {
              let nb = j*5+i
              let record = dataToTrain[nb]
              return (<td key={j}>
                <div className="over-container clickable" style={{margin: "auto", border: `4px solid ${selected[nb] ? 'blue' : 'white'}`}} onClick={() => imageClicked(nb)}>
                  <img src={record.image_id ? image_variant_path(record.image_id, "small") : "/default_recipe_01.png"} width="255" height="171" />
                  <h2 className="bottom-center font-satisfy" style={{borderRadius: "0.5em", border: "1px solid #777", color: "#333", bottom: "1em", backgroundColor: "#f5f5f5", fontSize: "1.2em", padding: "0.2em 0.8em 0 0.2em"}}>{record.name}</h2>
                </div>
              </td>)
            })}
          </tr>)
        })}
      </tbody>
    </table>
    <br/>
    <button type="button" className="btn btn-primary" onClick={submitData}>Soumettre</button>
  </>)
  
  //return (<>
  //  <div>
  //    <h2 style={{textAlign: 'center'}}>Entraîner: {filter.name}</h2>
  //    <div className="over-container" style={{margin: "auto"}}>
  //      <img src={record.image_id ? image_variant_path(record.image_id, "medium") : "/default_recipe_01.png"} style={{maxWidth: "100vw"}} width="452" height="304" />
  //      <h2 className="bottom-center font-satisfy" style={{borderRadius: "0.5em", border: "1px solid #777", color: "#333", bottom: "1em", backgroundColor: "#f5f5f5", fontSize: "2em", padding: "0.2em 0.8em 0 0.2em"}}>{record.name}</h2>
  //    </div>
  //    <div>
  //      <button type="button" className="btn btn-primary" onClick={() => {}}>1</button>
  //      <button type="button" className="btn btn-primary" onClick={() => {}}>2</button>
  //      <button type="button" className="btn btn-primary" onClick={() => {}}>3</button>
  //      <button type="button" className="btn btn-primary" onClick={() => {}}>4</button>
  //      <button type="button" className="btn btn-primary" onClick={() => {}}>5</button>
  //      <button type="button" className="btn btn-primary" onClick={() => {}}>6</button>
  //      <button type="button" className="btn btn-primary" onClick={() => {}}>7</button>
  //      <button type="button" className="btn btn-primary" onClick={() => {}}>8</button>
  //      <button type="button" className="btn btn-primary" onClick={() => {}}>9</button>
  //      <button type="button" className="btn btn-primary" onClick={() => {}}>10</button>
  //    </div>
  //  </div>
  //</>)
}

const EditConfig = ({recipeFilters, changePage, setRecipeFilters}) => {

  const removeRecipeFilter = (filter) => {
    ajax({url: recipe_filter_path(filter), type: 'DELETE', success: () => {
      let filters = recipeFilters.filter(f => f.id != filter.id)
      setRecipeFilters(filters)
    }})
  }

  const userFilters = recipeFilters.filter(f => f.user_id)
  const defaultFilters = recipeFilters.filter(f => !f.user_id)

  const editFilters = userFilters.map(filter => (
    <li key={filter.id}>
      <u className="clickable" onClick={() => changePage(3, {filterId: filter.id})}>{filter.name || "Sans nom"}</u>
      <DeleteConfirmButton id={`del-recipe-filter-${filter.id}`} onDeleteConfirm={() => removeRecipeFilter(filter)} message="Je veux supprimer ce filtre?" />
    </li>))
  const defFilters = defaultFilters.map(filter => (<li key={filter.id}>{filter.name || "Sans nom"}</li>))
    // TODO: Add the ability to remove default filters...
    // <DeleteConfirmButton id={`del-recipe-filter-${filter.id}`} onDeleteConfirm={() => removeRecipeFilter(filter)} message="Je veux supprimer ce filtre?" />

  return (<>
    <h2>Filtres</h2>
    <ul>
    {editFilters}
    {defFilters}
    </ul>
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
      changePage(3, {filterId: recipe_filter.id})
    }})
  }

  const buttons = recipeFilters.map(filter => <ChooseOccasionButton key={filter.id} winWidth={winWidth} image={`/img/${filter.image_src || "question-mark.jpg"}`} title={filter.name || "Sans nom"} handleClick={() => changePage(2, {filterId: filter.id})} />)

  // Pour recevoir des invités => (page suivantes, quelles restrictions => véganes)
  return (<>
    <div style={{maxWidth: "100vw", width: "400px", margin: "auto"}}>
      {buttons}
      <ChooseOccasionButton winWidth={winWidth} image="/img/plus.jpg" title="Nouveau" handleClick={() => createRecipeFilter()} />
      <ChooseOccasionButton winWidth={winWidth} image="/icons/gear-gray.svg" title="Paramètres" handleClick={() => changePage(4)} />
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
    3: 4,
    4: 1,
    5: 3,
  }

  const changePage = (pageNb, args=null) => {
    setCurrentPage(pageNb)
    setPageArgs(args)
  }

  const pages = {
    1: <ChooseOccasion changePage={changePage} recipeFilters={recipeFilters} addRecipeFilter={(filter) => setRecipeFilters(recipeFilters.concat([filter]))} />,
    2: <ChooseRecipe changePage={changePage} pageArgs={pageArgs} recipeFilters={recipeFilters} />,
    3: <EditFilter changePage={changePage} pageArgs={pageArgs} recipeFilters={recipeFilters} setRecipeFilters={setRecipeFilters} />,
    4: <EditConfig changePage={changePage} recipeFilters={recipeFilters} setRecipeFilters={setRecipeFilters} />,
    5: <TrainFilter changePage={changePage} pageArgs={pageArgs} recipeFilters={recipeFilters} setRecipeFilters={setRecipeFilters} />,
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
