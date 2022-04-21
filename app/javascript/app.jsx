import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Hammer from "react-hammerjs"
//var windowHistory = window.history // window.history.back() => same as back in browser
//import history from 'history/hash'

import { useCacheOrFetch } from "./lib"
import {RecipeIndex} from './recipe_index'
import { ajax, preloadImage, getUrlParams } from "./utils"
import { icon_path, recipe_kind_path, suggestions_path, image_variant_path, send_data_suggestions_path, batch_update_filtered_recipes_path, recipe_filters_path, recipe_filter_path, missing_filtered_recipes_path, user_recipes_recipes_path, new_recipe_path, new_book_path, user_books_books_path, my_books_path } from './routes'
import {TextField} from './form'
import {PublicImageField} from './modals/public_image'
import { DeleteConfirmButton } from './components/delete_confirm_button'
  
const encodeRecord = (record) => (`${record.class_name == "recipe_kind" ? '' : '_'}${record.id}`)

const ChooseRecipe = ({changePage, page, recipeFilters}) => {
  
  const [suggestions, setSuggestions] = useState([])
  const [suggestionNb, setSuggestionNb] = useState(0)
  const [maxSuggestionNb, setMaxSuggestionNb] = useState(0)
  const [recipePage, setRecipePage] = useState(1)
  const [doneFetching, setDoneFetching] = useState(false)
  const itemsPerPage = 5 // MATCH WITH SERVER CODE

  const filter = page && page.filterId ? recipeFilters.find(f => f.id == page.filterId) : null
 
  useEffect(() => {
    if (!recipeFilters || recipeFilters.length == 0) {return}
    ajax({url: suggestions_path({page: recipePage, recipe_filter_id: filter.id}), type: 'GET', success: (suggests) => {
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
  }, [recipePage, recipeFilters])
  
  if (!filter) {return ''}

  const nextSuggestion = () => {
    if (suggestionNb < suggestions.length-1) {
      let nb = suggestionNb + 1
      setSuggestionNb(nb)
      if (nb > maxSuggestionNb) { setMaxSuggestionNb(nb) }
    }
    if (!doneFetching && suggestionNb >= suggestions.length - 2) {
      setRecipePage(recipePage+1)
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

  console.log('nb', suggestionNb)
  console.log('suggestions', suggestions)
 
  let suggestion = suggestions ? suggestions[suggestionNb] : null
  if (!suggestion) {console.log('no suggestion to show'); return filter.name ? <h2 style={{textAlign: 'center'}}>{filter.name}</h2> : ''}

  const selectRecipe = () => {
    let skipped = []
    for (let i = 0; i < suggestionNb; i++) {
      skipped.push(encodeRecord(suggestions[i]))
    }
    for (let i = suggestionNb+1; i <= maxSuggestionNb; i++) {
      skipped.push(encodeRecord(suggestions[i]))
    }
    // send stats, which recipe was skipped, which was selected
    ajax({url: send_data_suggestions_path(), type: 'PATCH', data: {filterId: filter.id, skipped, selected: encodeRecord(suggestion)}, success: (suggests) => {
      window.location = recipe_kind_path(suggestion)
    }, error: () => {
      window.location = recipe_kind_path(suggestion)
    }})
  }
  
  //<button type="button" className="btn btn-danger" onClick={() => nextSuggestion()}>Non, pas cette fois</button>
  return (<>
    {filter.name ? <h2 style={{textAlign: 'center'}}>{filter.name}</h2> : ''}
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
          <button type="button" className="btn btn-primary" onClick={selectRecipe}>Cuisiner!</button>
        </div>
      </div>
    </Hammer>
  </>)
}

const EditFilter = ({changePage, page, recipeFilters, setRecipeFilters}) => {
  const [name, setName] = useState('')
  const filter = page && page.filterId ? recipeFilters.find(f => f.id == page.filterId) : null
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

const TrainFilter = ({changePage, page, recipeFilters, setRecipeFilters}) => {

  const filter = page && page.filterId ? recipeFilters.find(f => f.id == page.filterId) : null
  if (!filter) {console.log("Can't train filter, did not exist."); return '';}
  
  const [dataToTrain, setDataToTrain] = useState([])
  const [selected, setSelected] = useState({})
  const [doneFetching, setDoneFetching] = useState(false)

  const fetchBatch = () => {
    ajax({url: missing_filtered_recipes_path({recipe_filter_id: filter.id}), type: 'GET', success: (data) => {
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
    let data = dataToTrain.map((d,i) => ({filterable_type: d.class_name, filterable_id: d.id, selected: selected[i]}))
    ajax({url: batch_update_filtered_recipes_path(), type: 'POST', data: {recipe_filter_id: filter.id, data: JSON.stringify(data)}, success: () => {
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

  if (!dataToTrain || dataToTrain.length <= 0) {return <p>Il ne reste plus aucune recette ou catégorie à entrainer.</p>}

  return (<>
    <h2 style={{textAlign: 'center'}}>Quelle recette correspond à {filter.name} ?</h2>
    <table>
      <tbody>
        {[0,1,2,3,4].map(i => {
          return (<tr key={i}>
            {[0,1,2,3].map(j => {
              let nb = j*5+i
              let record = dataToTrain[nb]
              if (!record) {return <td key={j}></td>}
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
  const defFilters = defaultFilters.map(filter => {
    if (gon.current_user_admin) {
      return (
        <li key={filter.id}>
          <u className="clickable" onClick={() => changePage(3, {filterId: filter.id})}>{filter.name || "Sans nom"}</u>
          <DeleteConfirmButton id={`del-recipe-filter-${filter.id}`} onDeleteConfirm={() => removeRecipeFilter(filter)} message="Je veux supprimer ce filtre?" />
        </li>
      )
    } else {
      return <li key={filter.id}>{filter.name || "Sans nom"}</li>
    }
  })
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
  //<ChooseOccasionButton winWidth={winWidth} image="/img/recipes.jpg" title="Mes livres" handleClick={() => changePage(7)} />
  return (<>
    <div style={{maxWidth: "100vw", width: "400px", margin: "auto"}}>
      <ChooseOccasionButton winWidth={winWidth} image="/img/cooking.jpg" title="Mes recettes" handleClick={() => changePage(6)} />
      <ChooseOccasionButton winWidth={winWidth} image="/img/recipes.jpg" title="Mes livres" handleClick={() => {window.location.href = my_books_path()}} />
      {buttons}
      <ChooseOccasionButton winWidth={winWidth} image="/img/plus.jpg" title="Nouveau" handleClick={() => createRecipeFilter()} />
      <ChooseOccasionButton winWidth={winWidth} image="/icons/gear-gray.svg" title="Paramètres" handleClick={() => changePage(4)} />
    </div>
  </>)
}

const MyBooks = () => {

  const books = useCacheOrFetch(user_books_books_path())

  console.log('books', books)

  let key = 1
  return (<>
    <div className="d-flex gap-20" style={{alignItems: "center"}}>
      <h2>Mes livres</h2>
      <a href={new_book_path()} className="btn btn-outline-primary btn-sm">Nouveau livre</a>
    </div>
    <hr style={{marginTop: "0"}}/>
    <div className="position-limbo" style={{zIndex: 10}}>
      <span id={`prev-carrousel-${key}`} style={{left: "5px", top: "80px"}} className="my-tns-control" aria-disabled='true'><img src="/icons/custom-chevron-left.svg" size="45x90"/></span>
      <span id={`next-carrousel-${key}`} style={{left: "calc(100% - 50px)", top: "80px"}} className="my-tns-control"><img src="/icons/custom-chevron-right.svg" size="45x90"/></span>
    </div>
    <div style={{height: "2em"}}></div>
    <h2>Livres favoris</h2>
    <hr style={{marginTop: "0"}}/>
  </>)
}

const MyRecipes = () => {

  const data = useCacheOrFetch(user_recipes_recipes_path())
  const userRecipes = data ? data.userRecipes : null
  const favoriteRecipes = data ? data.favoriteRecipes : null
      //<%= link_to translated("Quoi manger?"), app_path, class: "btn btn-outline-secondary btn-sm" %>
  return (<>
    <div className="d-flex gap-20 align-items-center">
      <h2>Mes recettes</h2>
      <a href={new_recipe_path()} className="btn btn-outline-primary btn-sm">Nouvelle recette</a>
    </div>
    <RecipeIndex userRecipes={userRecipes} favoriteRecipes={favoriteRecipes} loading={!data} />
  </>)
}

const App = () => {

  const [recipeFilters, setRecipeFilters] = useState([])
  const [page, setPage] = useState(getUrlParams())
  //const [page, setPage] = useState({})
  
  useEffect(() => {
    if (window.gon && gon.recipe_filters) { setRecipeFilters(gon.recipe_filters) }

    //setPage(getUrlParams())
  }, [])

  const parentPages = {
    2: 1,
    3: 4,
    4: 1,
    5: 3,
    6: 1,
    7: 1,
  }

  const changePage = (pageNb, args={}) => {
    let s = {page: pageNb, ...args}
    window.history.replaceState(s, '', '?'+new URLSearchParams(s).toString())
    setPage(s)
  }

  const pages = {
    1: <ChooseOccasion changePage={changePage} recipeFilters={recipeFilters} addRecipeFilter={(filter) => setRecipeFilters(recipeFilters.concat([filter]))} />,
    2: <ChooseRecipe changePage={changePage} page={page} recipeFilters={recipeFilters} />,
    3: <EditFilter changePage={changePage} page={page} recipeFilters={recipeFilters} setRecipeFilters={setRecipeFilters} />,
    4: <EditConfig changePage={changePage} recipeFilters={recipeFilters} setRecipeFilters={setRecipeFilters} />,
    5: <TrainFilter changePage={changePage} page={page} recipeFilters={recipeFilters} setRecipeFilters={setRecipeFilters} />,
    6: <MyRecipes changePage={changePage} page={page} />,
    7: <MyBooks changePage={changePage} page={page} />,
  }

  const goUp = () => {
    if (page.page && parentPages[page.page]) {
      let s = {page: parentPages[page.page]}
      window.history.replaceState(s, '', '?'+new URLSearchParams(s).toString())
      setPage({page: parentPages[page.page]})
    }
  }

  let moveBtn = ''
  if (page.page && parentPages[page.page]) {
    moveBtn = <img className="clickable" src={icon_path("arrow-up-square.svg")} width="28" style={{paddingLeft: "0.5em"}} onClick={goUp} />
  }

  // Pour recevoir des invités => (page suivantes, quelles restrictions => véganes)
  return (<>
    <div className="d-flex align-items-center">
      {moveBtn}
      <div className="flex-grow-1"/>
      <h1 style={{marginBottom: "0"}}>Qu'est-ce qu'on mange?</h1>
      <div className="flex-grow-1"/>
    </div>
    <hr style={{color: "#aaa", marginTop: "0"}}/>
    {pages[page.page || 1]}
  </>)
}

document.addEventListener('DOMContentLoaded', () => {

  const root = document.getElementById('app')
  if (root) {ReactDOM.render(<App/>, root)}
})
