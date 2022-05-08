import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Hammer from "react-hammerjs"
//var windowHistory = window.history // window.history.back() => same as back in browser
//import history from 'history/hash'

import { useCacheOrFetch } from "./lib"
import {RecipeIndex} from './recipe_index'
import { omit, ajax, isBlank, preloadImage, getUrlParams, join, bindSetter } from "./utils"
import { icon_path, recipe_kind_path, suggestions_path, image_variant_path, send_data_suggestions_path, batch_update_filtered_recipes_path, batch_create_filtered_recipes_path, batch_destroy_filtered_recipes_path, recipe_filters_path, recipe_filter_path, missing_filtered_recipes_path, user_recipes_recipes_path, new_recipe_path, new_book_path, user_books_books_path, my_books_path, all_recipe_kinds_recipe_filters_path, recipe_path } from './routes'
import {TextField} from './form'
import {PublicImageField} from './modals/public_image'
import { DeleteConfirmButton } from './components/delete_confirm_button'

// The advantage of using this instead of the number is if I need to search and to refactor, I can easy
const PAGE_1 = 1 // TagIndex
const PAGE_2 = 2 // TagCategorySuggestions
const PAGE_3 = 3 // EditFilter
const PAGE_4 = 4 // EditConfig
const PAGE_5 = 5 // TrainFilter
const PAGE_6 = 6 // MyRecipes
const PAGE_7 = 7 // MyBooks
const PAGE_8 = 8 // SuggestionsOverview
const PAGE_9 = 9 // TagSuggestions
const PAGE_10 = 10
const PAGE_11 = 11
const PAGE_12 = 12
const PAGE_13 = 13
const PAGE_14 = 14
  
const encodeRecord = (record) => (`${record.class_name == "recipe_kind" ? '' : '_'}${record.id}`)

const LinkToPage = ({page, className, children, active, ...props}) => {
  const switchPage = (evt, page) => {
    evt.preventDefault()
    page.update(omit(page,'update'))
  }
  const href = '?'+new URLSearchParams(omit(page,'update')).toString()

  return <a className={join(className, active ? 'active' : null)} href={href} onClick={(e) => switchPage(e, page)} {...props}>{children}</a>
}

const SuggestionsNav = ({page}) => {
  return (<>
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <LinkToPage page={{...page, page: 9}} className="nav-link" active={page.page == 9}>Mes recettes</LinkToPage>
      </li>
      <li className="nav-item">
        <LinkToPage page={{...page, page: 2}} className="nav-link" active={page.page == 2}>Autres recettes</LinkToPage>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Filtres</a>
      </li>
    </ul>
    <br/>
  </>)
}

const RecipeSingleCarrousel = ({tag, suggestions, isCategory}) => {
  
  const [suggestionNb, setSuggestionNb] = useState(0)
  const [maxSuggestionNb, setMaxSuggestionNb] = useState(0)
  
  let suggestion = suggestions ? suggestions[suggestionNb] : null
  if (!suggestion) {console.log('no suggestion to show'); return ''}

  //const preloadSuggestion = (suggestion) => {
  //  console.log('preloading suggestion')
  //  if (suggestion.image_id) {
  //    preloadImage(image_variant_path(suggestion.image_id, "medium"))
  //  }
  //}

  const nextSuggestion = () => {
    if (suggestionNb < suggestions.length-1) {
      let nb = suggestionNb + 1
      setSuggestionNb(nb)
      if (nb > maxSuggestionNb) { setMaxSuggestionNb(nb) }
    }
    //if (suggestionNb+2 < suggestions.length-1 && suggestionNb == maxSuggestionNb) {
    //  preloadSuggestion(suggestions[suggestionNb])
    //}
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

  const sendStats = () => {
    let skipped = []
    for (let i = 0; i < suggestionNb; i++) {
      skipped.push(encodeRecord(suggestions[i]))
    }
    for (let i = suggestionNb+1; i <= maxSuggestionNb; i++) {
      skipped.push(encodeRecord(suggestions[i]))
    }
    ajax({url: send_data_suggestions_path(), type: 'PATCH', data: {filterId: tag.id, skipped, selected: encodeRecord(suggestion)}})
  }
  
  //<button type="button" className="btn btn-danger" onClick={() => nextSuggestion()}>Non, pas cette fois</button>
 
  const href = isCategory ? recipe_kind_path(suggestion) : recipe_path({id: suggestion.recipe_id})
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
            <img src={icon_path("custom-chevron-right.svg")} width="45" height="90" onClick={nextSuggestion} aria-disabled={suggestionNb >= suggestions.length-1} />
          </div>
        </div>
        <div style={{height: '0.5em'}}></div>
        <div id="choose-btns" className="d-flex flex-column">
          <a type="button" className="btn btn-primary" onClick={sendStats} href={href}>Cuisiner!</a>
        </div>
      </div>
    </Hammer>
  </>)
}

const TagSuggestions = ({tags, suggestions, page, changePage}) => {

  const tag = tags.find(f => f.id == page.filterId)
  if (!tag) {return ''}

  const tagSuggestions = suggestions.filter(suggestion => suggestion.filter_id == tag.id)

  return (<>
    <SuggestionsNav page={page} changePage={changePage} />
    {tag.name ? <h2 style={{textAlign: 'center'}}>{tag.name}</h2> : ''}
    <RecipeSingleCarrousel tag={tag} suggestions={tagSuggestions}/>
  </>)
}

const TagCategorySuggestions = ({changePage, page, recipeFilters}) => {

  const suggestions = useCacheOrFetch(suggestions_path({recipe_filter_id: page.filterId}))
  //useEffect(() => {
  //  console.log('inside use effect')
  //  if (suggestions) {
  //    for (let i = 0; i < 3 && i < suggestions.length-1; i++) {
  //      preloadSuggestion(suggestions[i])
  //    }
  //  }
  //}, [suggestions])

  const tag = recipeFilters.find(f => f.id == page.filterId)
  if (!tag) {return ''}

  return (<>
    <SuggestionsNav page={page} changePage={changePage} />
    {tag.name ? <h2 style={{textAlign: 'center'}}>{tag.name}</h2> : ''}
    <RecipeSingleCarrousel tag={tag} suggestions={suggestions} isCategory={true} />
  </>)
}

              //return (<td key={j}>
              //  <div className="over-container clickable" style={{margin: "auto", border: `4px solid ${selected[nb] ? 'blue' : 'white'}`}} onClick={() => imageClicked(nb)}>
              //    <img src={record.image_id ? image_variant_path(record.image_id, "small") : "/default_recipe_01.png"} width="255" height="171" />
              //    <h2 className="bottom-center font-satisfy" style={{borderRadius: "0.5em", border: "1px solid #777", color: "#333", bottom: "1em", backgroundColor: "#f5f5f5", fontSize: "1.2em", padding: "0.2em 0.8em 0 0.2em"}}>{record.name}</h2>
              //  </div>
              //</td>)
const RecipeImageWithTitle = ({record, selected, selectItem}) => {
  return <div className="over-container clickable d-inline-block" style={{border: `4px solid ${selected ? 'blue' : 'white'}`}} onClick={() => selectItem(record)}>
    <img src={record.image_id ? image_variant_path(record.image_id, "small") : "/default_recipe_01.png"} width="255" height="171" style={{maxWidth: "100vw"}} />
    <h2 className="bottom-center font-satisfy" style={{borderRadius: "0.5em", border: "1px solid #777", color: "#333", bottom: "1em", backgroundColor: "#f5f5f5", fontSize: "1.2em", padding: "0.2em 0.8em 0 0.2em"}}>{record.name}</h2>
  </div>
}

const SuggestionsOverview = ({changePage, page, recipeFilters}) => {
  const [selected, setSelected] = useState({})
  //const [matching, setMatching] = useState([])
  //const [notMatching, setNotMatching] = useState([])
  //const [unkown, setUnkown] = useState([])
  const [items, setItems] = useState(null)
  const fetchedItems = useCacheOrFetch(all_recipe_kinds_recipe_filters_path({recipe_filter_id: page.filterId}))
  useEffect(() => {if (fetchedItems) {setItems(fetchedItems)}}, [fetchedItems])
  //const all = useCacheOrFetch(all_recipe_kinds_recipe_filters_path({recipe_filter_id: page.filterId}))
  //useEffect(() => {
  //  if (all) {
  //    setMatching(all.matching)
  //    setNotMatching(all.not_matching)
  //    setUnkown(all.unkown)
  //  }
  //}, [all])
  //if (!all) {return 'Loading...'}
  if (!items) {return 'Loading...'}
  const unkown = items.filter(i => i.group == 0)
  const matching = items.filter(i => i.group == 1)
  const notMatching = items.filter(i => i.group == 2)

  const filter = recipeFilters.find(f => f.id == page.filterId)

  const selectItem = (item) => {
    let s = {...selected}; s[item.id] = !selected[item.id]; setSelected(s)
  }
  const selectAll = (its, select=true) => {
    let s = {...selected};
    its.forEach(i => {s[i.id] = select})
    setSelected(s)
  }

  const printItems = (items) => {
    return <div style={{marginLeft: "4px"}}>
      {((items || []).map((record) => {
        return <RecipeImageWithTitle record={record} key={record.id} selected={selected[record.id]} selectItem={selectItem} />
      }))}
    </div>
  }

  const updateItems = (its, match) => {
    let updateIds = its.filter(r => selected[r.id]).map(r => r.id)
    ajax({url: batch_update_filtered_recipes_path(), type: 'PATCH', data: {recipe_filter_id: filter.id, ids: updateIds, match}, success: () => {
      //let keepList = matching.filter((r,i) => !selected[i])
      //setMatching(all.matching)
      //setNotMatching(all.not_matching)
      //setUnkown(all.unkown)
      setItems(items.map(item => {
        if (updateIds.includes(item.id)) { item.group = match ? 1 : 2 }
        return item
      }))
      setSelected({})
    }, error: (err) => {
      console.log('Error updateItems', err)
    }})
  }
  const addItems = (its, match) => {
    let f = its.filter(r => selected[r.id])
    let ids = f.map(r => r.id)
    let data = f.map((d,i) => ({filterable_type: d.class_name, filterable_id: d.id, selected: match}))
    ajax({url: batch_create_filtered_recipes_path(), type: 'POST', data: {recipe_filter_id: filter.id, data: JSON.stringify(data)}, success: () => {
      setItems(items.map(item => {
        if (ids.includes(item.id)) { item.group = match ? 1 : 2 }
        return item
      }))
      setSelected({})
    }, error: (err) => {
      console.log('Error addItems', err)
    }})
  }

  const filterName = `«${filter.name}»`

  return (<>
    <h3>Recette(s) non catégorisée(s) du filtre {filterName}?</h3>
    {isBlank(unkown) ? <p>Auncune recette non catégorisée.</p> : printItems(unkown)}
    <button type="button" className="btn btn-outline-primary" onClick={() => selectAll(unkown, true)}>Tout sélectionner</button>
    <button type="button" className="btn btn-outline-primary" style={{marginLeft: "0.5em"}} onClick={() => selectAll(unkown, false)}>Tout désélectionner</button>
    <button type="button" className="btn btn-primary" style={{marginLeft: "0.5em"}} onClick={() => addItems(unkown, true)}>Correspond</button>
    <button type="button" className="btn btn-primary" style={{marginLeft: "0.5em"}} onClick={() => addItems(unkown, false)}>Ne correspond pas</button>
    <h3>Recette(s) qui correspond(ent) au filtre {filterName}</h3>
    {isBlank(matching) ? <p>Auncune recette correspond au filtre.</p> : printItems(matching)}
    <button type="button" className="btn btn-primary" onClick={() => updateItems(matching, false)}>Retirer du filtre</button>
    <h3>Recette(s) qui ne correspond(ent) pas au filtre {filterName}</h3>
    {isBlank(notMatching) ? <p>Auncune recette correspond au filtre.</p> : printItems(notMatching)}
    <button type="button" className="btn btn-primary" onClick={() => updateItems(notMatching, true)}>Ajouter au filtre</button>
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
      <button type="button" className="btn btn-primary" onClick={() => changePage(5, {filterId: filter.id})}>Filtrer les nouvelles suggestions</button>
    </div>
    <br/>
    <div>
      <button type="button" className="btn btn-primary" onClick={() => {}}>Modifier les filtres</button>
    </div>
    <br/>
    <div>
      <button type="button" className="btn btn-primary" onClick={() => changePage(8, {filterId: filter.id})}>Voir les suggestions</button>
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
    ajax({url: batch_create_filtered_recipes_path(), type: 'POST', data: {recipe_filter_id: filter.id, data: JSON.stringify(data)}, success: () => {
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
      <u className="cursor-pointer" onClick={() => changePage(3, {filterId: filter.id})}>{filter.name || "Sans nom"}</u>
      <DeleteConfirmButton id={`del-recipe-filter-${filter.id}`} onDeleteConfirm={() => removeRecipeFilter(filter)} message="Je veux supprimer ce filtre?" />
    </li>))
  const defFilters = defaultFilters.map(filter => {
    if (gon.current_user_admin) {
      return (
        <li key={filter.id}>
          <u className="cursor-pointer" onClick={() => changePage(3, {filterId: filter.id})}>{filter.name || "Sans nom"}</u>
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

const TagButton = ({winWidth, image, title, handleClick}) => {
  return (
    <div style={{width: `${Math.min(200, winWidth/2)}px`, padding: `${Math.min(25, (winWidth-300)/4)}px`, display: "inline-block"}}>
      <button className="plain-btn d-flex p-1 flex-column align-items-center" onClick={handleClick}>
        <img src={image} width="150" height="150" />
        <b>{title}</b>
      </button>
    </div>
  )
}
const TagIndex = ({recipeFilters, addRecipeFilter, changePage}) => {

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

  const buttons = recipeFilters.map(filter => <TagButton key={filter.id} winWidth={winWidth} image={`/img/${filter.image_src || "question-mark.jpg"}`} title={filter.name || "Sans nom"} handleClick={() => changePage(PAGE_9, {filterId: filter.id})} />)

  // Pour recevoir des invités => (page suivantes, quelles restrictions => véganes)
  //<TagButton winWidth={winWidth} image="/img/recipes.jpg" title="Mes livres" handleClick={() => changePage(7)} />
  return (<>
    <div style={{maxWidth: "100vw", width: "400px", margin: "auto"}}>
      <TagButton winWidth={winWidth} image="/img/cooking.jpg" title="Mes recettes" handleClick={() => changePage(6)} />
      <TagButton winWidth={winWidth} image="/img/recipes.jpg" title="Mes livres" handleClick={() => {window.location.href = my_books_path()}} />
      {buttons}
      <TagButton winWidth={winWidth} image="/img/plus.jpg" title="Nouveau" handleClick={() => createRecipeFilter()} />
      <TagButton winWidth={winWidth} image="/icons/gear-gray.svg" title="Paramètres" handleClick={() => changePage(4)} />
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

const MyRecipes = ({suggestions, tags}) => {

  const data = useCacheOrFetch(user_recipes_recipes_path())
  const userRecipes = data ? data.userRecipes : null
  const favoriteRecipes = data ? data.favoriteRecipes : null
      //<%= link_to translated("Quoi manger?"), app_path, class: "btn btn-outline-secondary btn-sm" %>
  return (<>
    <div className="d-flex gap-20 align-items-center">
      <h2>Mes recettes</h2>
      <a href={new_recipe_path()} className="btn btn-outline-primary btn-sm">Nouvelle recette</a>
    </div>
    <RecipeIndex userRecipes={userRecipes} favoriteRecipes={favoriteRecipes} loading={!data} suggestions={suggestions} tags={tags} />
  </>)
}

const App = () => {

  const [recipeFilters, setRecipeFilters] = useState([])
  const [suggestions, setSuggestions] = useState(gon.suggestions)

  bindSetter(suggestions, setSuggestions)
  const [page, setPage] = useState(getUrlParams())
  bindSetter(page, setPage)
  //const [page, setPage] = useState({})
  
  useEffect(() => {
    if (window.gon && gon.recipe_filters) { setRecipeFilters(gon.recipe_filters) }

    //setPage(getUrlParams())
  }, [])

  const parentPages = {
    PAGE_2: PAGE_1,
    PAGE_3: PAGE_4,
    PAGE_4: PAGE_1,
    PAGE_5: PAGE_3,
    PAGE_6: PAGE_1,
    PAGE_7: PAGE_1,
    PAGE_8: PAGE_3, // SuggestionsOverview => EditFilter
    PAGE_9: PAGE_1,
  }

  const changePage = (pageNb, args={}) => {
    let s = {page: pageNb, ...(omit(args, 'update'))}
    window.history.replaceState(s, '', '?'+new URLSearchParams(s).toString())
    setPage(s)
  }

  const pages = {
    1: <TagIndex changePage={changePage} recipeFilters={recipeFilters} addRecipeFilter={(filter) => setRecipeFilters(recipeFilters.concat([filter]))} />,
    2: <TagCategorySuggestions changePage={changePage} page={page} recipeFilters={recipeFilters} />,
    3: <EditFilter changePage={changePage} page={page} recipeFilters={recipeFilters} setRecipeFilters={setRecipeFilters} />,
    4: <EditConfig changePage={changePage} recipeFilters={recipeFilters} setRecipeFilters={setRecipeFilters} />,
    5: <TrainFilter changePage={changePage} page={page} recipeFilters={recipeFilters} setRecipeFilters={setRecipeFilters} />,
    6: <MyRecipes changePage={changePage} page={page} suggestions={suggestions} tags={recipeFilters} />,
    7: <MyBooks changePage={changePage} page={page} />,
    8: <SuggestionsOverview changePage={changePage} page={page} recipeFilters={recipeFilters} />,
    9: <TagSuggestions changePage={changePage} page={page} suggestions={suggestions} tags={recipeFilters} />,
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
