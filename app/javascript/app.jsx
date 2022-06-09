import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Hammer from "react-hammerjs"
//var windowHistory = window.history // window.history.back() => same as back in browser
//import history from 'history/hash'

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useCacheOrFetch, useWindowWidth } from "./lib"
import {RecipeIndex} from './recipe_index'
import { omit, ajax, isBlank, preloadImage, getUrlParams, join, bindSetter, sortBy, capitalize } from "./utils"
import { icon_path, recipe_kind_path, suggestions_path, image_variant_path, send_data_suggestions_path, batch_update_filtered_recipes_path, batch_create_filtered_recipes_path, batch_destroy_filtered_recipes_path, recipe_filters_path, recipe_filter_path, missing_filtered_recipes_path, user_recipes_recipes_path, new_recipe_path, new_book_path, user_books_books_path, my_books_path, all_recipe_kinds_recipe_filters_path, recipe_path, user_tags_path, user_tag_path, containers_path, grocery_list_path, calendar_path, inventory_path, mixes_path, mix_path } from './routes'
import {TextField, AutocompleteInput, TextInput} from './form'
import {PublicImageField} from './modals/public_image'
import { DeleteConfirmButton } from './components/delete_confirm_button'
import {AddUserTagModal} from './modals/add_user_tag'

// The advantage of using this instead of the number is if I need to search and to refactor, I can easy
const PAGE_1 = 1 // TagIndex
const PAGE_2 = 2 // TagCategorySuggestions
const PAGE_3 = 3 // EditFilter
const PAGE_4 = 4 // EditUserTags
//const PAGE_5 = 5 // TrainFilter
const PAGE_6 = 6 // MyRecipes
const PAGE_7 = 7 // MyBooks
const PAGE_8 = 8 // TagEditAllCategories
const PAGE_9 = 9 // TagSuggestions
const PAGE_10 = 10 // HedaIndex
const PAGE_11 = 11 // Inventory
const PAGE_12 = 12 // MixIndex
const PAGE_13 = 13 // ShowMix
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

const SuggestionsNav = ({page, tagSuggestions, categorySuggestions}) => {
  return (<>
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <LinkToPage page={{...page, page: 9}} className="nav-link" active={page.page == 9}>Mes recettes{tagSuggestions ? ` (${tagSuggestions.length})` : ''}</LinkToPage>
      </li>
      <li className="nav-item">
        <LinkToPage page={{...page, page: 2}} className="nav-link" active={page.page == 2}>Autres recettes{categorySuggestions ? ` (${categorySuggestions.length})` : ''}</LinkToPage>
      </li>
    </ul>
    <br/>
  </>)
}

const RecipeSingleCarrousel = ({tag, suggestions, isCategory}) => {
  
  const [suggestionNb, setSuggestionNb] = useState(0)
  const [maxSuggestionNb, setMaxSuggestionNb] = useState(0)

  const nextSuggestion = () => {
    if (suggestions && suggestionNb < suggestions.length-1) {
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
  
  let onKeyDown = ({key}) => {
    if (key == "ArrowLeft") {previousSuggestion()}
    if (key == "ArrowRight") {nextSuggestion()}
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    }
  }, [])
  
  let suggestion = suggestions ? suggestions[suggestionNb] : null
  if (!suggestion) {console.log('no suggestion to show'); return ''}

  //const preloadSuggestion = (suggestion) => {
  //  console.log('preloading suggestion')
  //  if (suggestion.image_id) {
  //    preloadImage(image_variant_path(suggestion.image_id, "medium"))
  //  }
  //}
  
  let handleSwipe = ({direction}) => {
    if (direction == 2) { // left
      nextSuggestion()
    } else if (direction == 4) { // right
      previousSuggestion()
    }
  }

  const sendStats = () => {
    if (!isCategory) {
      let skipped = []
      for (let i = 0; i < suggestionNb; i++) {
        skipped.push(encodeRecord(suggestions[i]))
      }
      for (let i = suggestionNb+1; i <= maxSuggestionNb; i++) {
        skipped.push(encodeRecord(suggestions[i]))
      }
      ajax({url: send_data_suggestions_path(), type: 'PATCH', data: {filterId: tag.id, skipped, selected: encodeRecord(suggestion)}})
    }
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
    <SuggestionsNav {...{page, changePage, tagSuggestions}} />
    {tag.name ? <h2 style={{textAlign: 'center'}}>{tag.name}</h2> : ''}
    <RecipeSingleCarrousel tag={tag} suggestions={tagSuggestions}/>
  </>)
}

const TagCategorySuggestions = ({changePage, page, recipeFilters, suggestions}) => {

  const tag = recipeFilters.find(f => f.id == page.filterId)
  if (!tag) {return ''}

  const categorySuggestions = useCacheOrFetch(suggestions_path({recipe_filter_id: page.filterId}))
  const tagSuggestions = suggestions.filter(suggestion => suggestion.filter_id == tag.id)

  //useEffect(() => {
  //  console.log('inside use effect')
  //  if (suggestions) {
  //    for (let i = 0; i < 3 && i < suggestions.length-1; i++) {
  //      preloadSuggestion(suggestions[i])
  //    }
  //  }
  //}, [suggestions])

  return (<>
    <SuggestionsNav {...{page, changePage, tagSuggestions, categorySuggestions}} />
    {tag.name ? <h2 style={{textAlign: 'center'}}>{tag.name}</h2> : ''}
    <RecipeSingleCarrousel tag={tag} suggestions={categorySuggestions} isCategory={true} />
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

const TagEditAllCategories = ({changePage, page, recipeFilters}) => {
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
      <button type="button" className="btn btn-primary" onClick={() => {}}>Modifier les recettes correspondantes (not implemented yet)</button>
    </div>
    <br/>
    <div>
      <button type="button" className="btn btn-primary" onClick={() => changePage(8, {filterId: filter.id})}>Modifier les catégories correspondantes</button>
    </div>
  </>)
}

const EditUserTags = ({userTags, recipeFilters, setRecipeFilters, page}) => {

  //userTags = sortBy(userTags, "position") Not necessary, done on server side

  const removeUserTag = (userTag) => {
    ajax({url: user_tag_path(userTag), type: 'DELETE', success: () => {
      userTags.update(userTags.filter(f => f.id != userTag.id))
    }})
  }
  
  const [showAddModal, setShowAddModal] = useState(false)

  const userTagsC = userTags.map((userTag, index) => {
    let tag = recipeFilters.find(t => t.id == userTag.tag_id)
    return <Draggable key={`drag-user-tag-${userTag.id}`} draggableId={`drag-user-tag-${userTag.id.toString()}`} index={index}>
      {(provided) => (<>
        <div className="item-container" ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
          <li>
            <span className="cursor-pointer" onClick={() => page.update({page: 3, filterId: tag.id})}>{tag.name || "Sans nom"}</span>
            <DeleteConfirmButton id={`del-user-tag-${userTag.id}`} onDeleteConfirm={() => removeUserTag(userTag)} message="Je veux retirer cette étiquette?" />
          </li>
        </div>
      </>)}
    </Draggable>
  })

  const handleDrop = ({source, destination, type, draggableId}) => {
    if (!destination) return; // Ignore drop outside droppable container
    
    let userTagId = draggableId.substr(14) // removes "drag-user-tag-"

    var updatedList = [...userTags];
    const [reorderedItem] = updatedList.splice(source.index, 1);
    updatedList.splice(destination.index, 0, reorderedItem);

    let data = {position: destination.index+1}
    ajax({url: user_tag_path({id: userTagId}), type: 'PATCH', data, success: () => {
      updatedList.forEach((el,i) => {el.position = i+1}) 
      userTags.update(updatedList)
    }})
  }

  return (<>
    <AddUserTagModal showModal={showAddModal} setShowModal={setShowAddModal} tags={recipeFilters} userTags={userTags} />
    <div className="d-flex gap-15 align-items-center">
      <h2>Étiquettes</h2>
      <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setShowAddModal(true)}>Ajouter une étiquette</button>
    </div>
    <DragDropContext onDragEnd={handleDrop}>
      <Droppable droppableId="user-tags-container">
        {(provided) => (<>
          <div className="user-tags-container" {...provided.droppableProps} ref={provided.innerRef}>
            <ul>
              {userTagsC}
            </ul>
            {provided.placeholder}
          </div>
        </>)}
      </Droppable>
    </DragDropContext>
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
const TagIndex = ({machines, recipeFilters, addRecipeFilter, changePage, userTags}) => {

  const winWidth = useWindowWidth()

  //const createRecipeFilter = () => {
  //  ajax({url: recipe_filters_path(), type: 'POST', data: {}, success: (recipe_filter) => {
  //    addRecipeFilter(recipe_filter)
  //    changePage(3, {filterId: recipe_filter.id})
  //  }})
  //}

  //const buttons = recipeFilters.map(filter => <TagButton key={filter.id} winWidth={winWidth} image={`/img/${filter.image_src || "question-mark.jpg"}`} title={filter.name || "Sans nom"} handleClick={() => changePage(PAGE_9, {filterId: filter.id})} />)
  const buttons = userTags.map(userTag => {
    let tag = recipeFilters.find(t => t.id == userTag.tag_id)
    return <TagButton key={userTag.id} winWidth={winWidth} image={`/img/${tag.image_src || "question-mark.jpg"}`} title={tag.name || "Sans nom"} handleClick={() => changePage(PAGE_9, {filterId: tag.id})} />
  })

  const machineButtons = machines.map(machine => {
    return <TagButton key={`machine-${machine.id}`} winWidth={winWidth} image='/img/robot.jpg' title={machine.name || "Heda"} handleClick={() => changePage(PAGE_10, {machineId: machine.id})} />
  })

  // Pour recevoir des invités => (page suivantes, quelles restrictions => véganes)
  //<TagButton winWidth={winWidth} image="/img/recipes.jpg" title="Mes livres" handleClick={() => changePage(7)} />
  return (<>
    <div style={{maxWidth: "100vw", width: "400px", margin: "auto"}}>
      <TagButton winWidth={winWidth} image="/img/cooking.jpg" title="Mes recettes" handleClick={() => changePage(PAGE_6)} />
      <TagButton winWidth={winWidth} image="/img/recipes.jpg" title="Mes livres" handleClick={() => {window.location.href = my_books_path()}} />
      {machineButtons}
      {buttons}
      <TagButton winWidth={winWidth} image="/icons/gear-gray.svg" title="Paramètres" handleClick={() => changePage(PAGE_4)} />
    </div>
  </>)
}

const ShowMix = ({page, machines, mixes, ...args}) => {

  const machine = machines.find(m => m.id == page.machineId)
  const machineFoods = args.machineFoods.filter(m => m.machine_id == page.machineId)
  const mix = mixes.find(m => m.id == page.mixId)
  console.log('mix', mix)

  const update = () => {
    ajax({url: mix_path(mix), type: 'PATCH', data: {mix: {name: mix.name, instructions: mix.instructions}}, success: (mix) => {
      mixes.update(mixes.map(e => e.id == mix.id ? mix : e))
    }})
  }
  
  const instructions = (mix.instructions||'').split(';')

  const addInstruction = () => {
    mix.instructions = (mix.instructions||'')+';'; update()
  }
  const updateName = (newName) => {
    mix.name = newName; update()
  }
  const changeInstruction = (cmd,line) => {
    instructions[line] = cmd
    mix.instructions = instructions.join(';')
    update()
  }
  const updateArg = (argNb, value, line) => {
    let args = instructions[line].split(',')
    args[argNb] = value
    instructions[line] = args.join(',')
    mix.instructions = instructions.join(';')
    update()
  }

  const INSTRUCTION_LIST = ["ADD", "CONTAINER", "MIX"]

  const eInstructions = instructions.map((instruction,line) => {

    let args = instruction.split(',')
    let cmd = args[0]||'ADD'

    let eArgs = ''
    if (cmd == 'ADD') {
      let machineFoodId = args[2]
      let machineFood = machineFoods.find(e => e.id == machineFoodId)
      let machineFoodName = machineFood ? machineFood.name : null
      eArgs = (<>
        <TextInput defaultValue={args[1]} onBlur={(qty) => updateArg(1, qty, line)} />
        <AutocompleteInput name="food" choices={machineFoods} defaultValue={machineFoodName} onSelect={(e, term, item) => updateArg(2, item.dataset.id, line)} minChars={0} />
      </>)
    }

    return (<li key={`${line}-${instruction}`} className="list-group-item d-flex gap-10">
        <div className="dropdown">
          <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {cmd}
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {INSTRUCTION_LIST.filter(e => e != cmd).map((e,i) => (
              <span key={i} className="dropdown-item" onClick={() => changeInstruction(e, line)}>{e}</span>
            ))}
          </div>
        </div>
        {eArgs}
      </li>
    )
  })

  return (<>
    <h1 contentEditable suppressContentEditableWarning={true} onBlur={(e) => {updateName(e.target.innerText)}}>
      {mix.name || 'Sans nom'}
    </h1>
    <h2>Instructions</h2>
    <ul className="list-group">{eInstructions}</ul>
    <div style={{height: '0.5em'}}></div>
    <img className="clickable" src="/icons/plus-circle.svg" width="24" height="24" onClick={addInstruction}></img>
  </>)
}

const MixIndex = ({page, machines, mixes, ...args}) => {

  const machine = machines.find(m => m.id == page.machineId)
  const machineFoods = args.machineFoods.filter(m => m.machine_id == page.machineId)

  const createMix = () => {
    ajax({url: mixes_path(), type: 'POST', data: {}, success: (mix) => {
      mixes.update([...mixes, mix])
    }})
  }
  const destroyMix = (mix) => {
    ajax({url: mix_path(mix), type: 'DELETE', success: () => {
      mixes.update(mixes.filter(e => e.id != mix.id))
    }})
  }

  const eMixes = mixes.map(mix => {
    return <li key={mix.id} className="list-group-item">
      <span className="clickable" onClick={() => page.update({page: PAGE_13, machineId: machine.id, mixId: mix.id})}>{mix.name || 'Sans nom'}</span>
      <img className="clickable float-end" src="/icons/x-lg.svg" width="18" height="18" onClick={() => destroyMix(mix)}></img>
    </li>
  })

  return (<>
    <h1>Mes mélanges</h1>
    <ul className="list-group">{eMixes}</ul>
    <div style={{height: '0.5em'}}></div>
    <img className="clickable" src="/icons/plus-circle.svg" width="24" height="24" onClick={createMix}></img>
  </>)
}

const Inventory = ({page, machines, containerQuantities, ...args}) => {

  const machine = machines.find(m => m.id == page.machineId)
  const machineFoods = args.machineFoods.filter(m => m.machine_id == page.machineId)

  const items = machineFoods.map(machineFood => {
    let qties = containerQuantities.filter(c => c.machine_food_id == machineFood.id)

    //<img src={`JarIcon${containerQuantity.container_format_name}.png`} width="42" height="42"></img>
    let containers = qties.map(containerQuantity =>{
      return (<span key={containerQuantity.id}>
        <span>{containerQuantity.full_qty}</span>
        <img src={`jar-${containerQuantity.container_format_name}.svg`} width="42" height="42"></img>
      </span>)
    })

    return (
      <tr key={machineFood.id}>
        <td>{capitalize(machineFood.name)}</td>
        <td>
          <div className="containers d-flex">
            <div>
              <div></div>
              <div></div>
            </div>
          </div>
        </td>
        <td>
        </td>
        <td>{containers}</td>
        <td>Modifier</td>
      </tr>
    )
  })

  return (<>
    <p>Chaque aliment est assigné une quantité souhaitée. Par exemple, je veux avoir 2 gros pots de sucre et 1 gros pot de flocons d'avoine. L'IA va alors ajouté à la liste d'épicerie le sucre lorsqu'il reste 0.999 gros pots de sucre et moins, et 0.333 gros pots de flocons d'avoine (approximatif). L'IA regarde les habitudes alimentaire et les prochains repas à être cuisiner pour déterminer cela.</p>

    <table id="inventory" className="table table-striped table-sm">
      <thead className="thead-dark">
        <tr>
          <th>Food</th>
          <th>Pot utilisé</th>
          <th>Quantité</th>
          <th>Souhaitée</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{items}</tbody>
    </table>

    <h3>Add a food</h3>
  </>)
}

const HedaIndex = ({page, machines}) => {

  const machine = machines.find(m => m.id == page.machineId)
  const winWidth = useWindowWidth()

  return (<>
    <div style={{maxWidth: "100vw", width: "400px", margin: "auto"}}>
      <TagButton winWidth={winWidth} image="/img/calendar.jpg" title="Calendrier" handleClick={() => window.location.href = calendar_path(machine)} />
      <TagButton winWidth={winWidth} image="/img/blender.jpg" title="Mélanges" handleClick={() => page.update({page: PAGE_12, machineId: machine.id})} />
      <TagButton winWidth={winWidth} image="/img/bar_code.jpg" title="Inventaire" handleClick={() => page.update({page: PAGE_11, machineId: machine.id})} />
    
      <TagButton winWidth={winWidth} image="/img/jar.svg" title="Pots" handleClick={() => window.location.href = containers_path(machine)} />
      <TagButton winWidth={winWidth} image="/img/shopping_cart.jpg" title="Liste d'épicerie" handleClick={() => window.location.href = grocery_list_path(machine)} />
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

const MyRecipes = ({suggestions, tags, userRecipes, favoriteRecipes}) => {

  //const data = useCacheOrFetch(user_recipes_recipes_path())
  //const userRecipes = data ? data.userRecipes : null
  //const favoriteRecipes = data ? data.favoriteRecipes : null
      //<%= link_to translated("Quoi manger?"), app_path, class: "btn btn-outline-secondary btn-sm" %>
    //<RecipeIndex userRecipes={userRecipes} favoriteRecipes={favoriteRecipes} loading={!data} suggestions={suggestions} tags={tags} />
  return (<>
    <div className="d-flex gap-20 align-items-center">
      <h2>Mes recettes</h2>
      <a href={new_recipe_path()} className="btn btn-outline-primary btn-sm">Nouvelle recette</a>
    </div>
    <RecipeIndex userRecipes={userRecipes} favoriteRecipes={favoriteRecipes} loading={false} suggestions={suggestions} tags={tags} />
  </>)
}

const useUpdatableState = (initial) => {
  const [state, setState] = useState(initial)
  bindSetter(state, setState)
  return state
}

const App = () => {

  const [page, setPage] = useState(getUrlParams())

  const [recipeFilters, setRecipeFilters] = useState(gon.recipe_filters)
  const [suggestions, setSuggestions] = useState(gon.suggestions)
  const [userTags, setUserTags] = useState(gon.user_tags)
  const [userRecipes, setUserRecipes] = useState(gon.user_recipes)
  const [favoriteRecipes, setFavoriteRecipes] = useState(gon.favorite_recipes)
  const machines = useUpdatableState(gon.machines)
  const machineFoods = useUpdatableState(gon.machine_foods)
  const containerQuantities = useUpdatableState(gon.container_quantities)
  const mixes = useUpdatableState(gon.mixes)

  bindSetter(recipeFilters, setRecipeFilters)
  bindSetter(suggestions, setSuggestions)
  bindSetter(userTags, setUserTags)
  bindSetter(userRecipes, setUserRecipes)
  bindSetter(favoriteRecipes, setFavoriteRecipes)
  
  const parentPages = {
    [PAGE_2]: PAGE_1,
    [PAGE_3]: PAGE_4,
    [PAGE_4]: PAGE_1,
    //[PAGE_5]: PAGE_3,
    [PAGE_6]: PAGE_1,
    [PAGE_7]: PAGE_1,
    [PAGE_8]: PAGE_3, // TagEditAllCategories => EditFilter
    [PAGE_9]: PAGE_1,
    [PAGE_10]: PAGE_1,
    [PAGE_11]: PAGE_10,
    [PAGE_12]: PAGE_10,
    [PAGE_13]: PAGE_12,
  }

  // Deprecated, use page.update(newPage) which uses changePageV2
  const changePage = (pageNb, args={}) => {
    let s = {page: pageNb, ...(omit(args, 'update'))}
    window.history.replaceState(s, '', '?'+new URLSearchParams(s).toString())
    setPage(s)
  }
  const changePageV2 = (page) => {
    let s = omit(page, 'update')
    window.history.replaceState(s, '', '?'+new URLSearchParams(s).toString())
    setPage(s)
  }
  bindSetter(page, changePageV2)

  const pages = {
    [PAGE_1]: <TagIndex {...{changePage, recipeFilters, userTags, machines}} addRecipeFilter={(filter) => setRecipeFilters(recipeFilters.concat([filter]))} />,
    [PAGE_2]: <TagCategorySuggestions {...{page, changePage, recipeFilters, suggestions}} />,
    [PAGE_3]: <EditFilter changePage={changePage} page={page} recipeFilters={recipeFilters} setRecipeFilters={setRecipeFilters} />,
    [PAGE_4]: <EditUserTags recipeFilters={recipeFilters} setRecipeFilters={setRecipeFilters} userTags={userTags} page={page} />,
    //5: <TrainFilter changePage={changePage} page={page} recipeFilters={recipeFilters} setRecipeFilters={setRecipeFilters} />,
    [PAGE_6]: <MyRecipes changePage={changePage} page={page} suggestions={suggestions} tags={recipeFilters} favoriteRecipes={favoriteRecipes} userRecipes={userRecipes} />,
    [PAGE_7]: <MyBooks changePage={changePage} page={page} />,
    [PAGE_8]: <TagEditAllCategories changePage={changePage} page={page} recipeFilters={recipeFilters} />,
    [PAGE_9]: <TagSuggestions changePage={changePage} page={page} suggestions={suggestions} tags={recipeFilters} />,
    [PAGE_10]: <HedaIndex {...{page, machines}} />,
    [PAGE_11]: <Inventory {...{page, machines, machineFoods, containerQuantities}} />,
    [PAGE_12]: <MixIndex {...{page, machines, machineFoods, mixes}} />,
    [PAGE_13]: <ShowMix {...{page, machines, machineFoods, mixes}} />,
  }

  // I don't want a back system, I want a up system. So if you are given a nested link, you can go up.
  const goUp = () => {
    if (page.page && parentPages[page.page]) {
      let s = {...omit(page, 'update'), page: parentPages[page.page]}
      window.history.replaceState(s, '', '?'+new URLSearchParams(s).toString())
      setPage(s)
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


//const TrainFilter = ({changePage, page, recipeFilters, setRecipeFilters}) => {
//
//  const filter = page && page.filterId ? recipeFilters.find(f => f.id == page.filterId) : null
//  if (!filter) {console.log("Can't train filter, did not exist."); return '';}
//  
//  const [dataToTrain, setDataToTrain] = useState([])
//  const [selected, setSelected] = useState({})
//  const [doneFetching, setDoneFetching] = useState(false)
//
//  const fetchBatch = () => {
//    ajax({url: missing_filtered_recipes_path({recipe_filter_id: filter.id}), type: 'GET', success: (data) => {
//      if (!data || data == []) {
//        console.log('done fetching received ', data)
//        setDoneFetching(true)
//      }
//      setSelected({})
//      setDataToTrain(data)
//    }})
//  }
//
//  useEffect(() => {
//    fetchBatch()
//  }, [])
//
//  const submitData = () => {
//    let data = dataToTrain.map((d,i) => ({filterable_type: d.class_name, filterable_id: d.id, selected: selected[i]}))
//    ajax({url: batch_create_filtered_recipes_path(), type: 'POST', data: {recipe_filter_id: filter.id, data: JSON.stringify(data)}, success: () => {
//      console.log('Fetching second batch of data')
//      fetchBatch()
//    }, error: (err) => {
//      console.log('Error sending training data', err)
//    }})
//  }
//              
//  const imageClicked = (nb) => {
//    let s = {...selected}
//    s[nb] = !s[nb]
//    setSelected(s)
//  }
//
//  if (!dataToTrain || dataToTrain.length <= 0) {return <p>Il ne reste plus aucune recette ou catégorie à entrainer.</p>}
//
//  return (<>
//    <h2 style={{textAlign: 'center'}}>Quelle recette correspond à {filter.name} ?</h2>
//    <table>
//      <tbody>
//        {[0,1,2,3,4].map(i => {
//          return (<tr key={i}>
//            {[0,1,2,3].map(j => {
//              let nb = j*5+i
//              let record = dataToTrain[nb]
//              if (!record) {return <td key={j}></td>}
//              return (<td key={j}>
//                <div className="over-container clickable" style={{margin: "auto", border: `4px solid ${selected[nb] ? 'blue' : 'white'}`}} onClick={() => imageClicked(nb)}>
//                  <img src={record.image_id ? image_variant_path(record.image_id, "small") : "/default_recipe_01.png"} width="255" height="171" />
//                  <h2 className="bottom-center font-satisfy" style={{borderRadius: "0.5em", border: "1px solid #777", color: "#333", bottom: "1em", backgroundColor: "#f5f5f5", fontSize: "1.2em", padding: "0.2em 0.8em 0 0.2em"}}>{record.name}</h2>
//                </div>
//              </td>)
//            })}
//          </tr>)
//        })}
//      </tbody>
//    </table>
//    <br/>
//    <button type="button" className="btn btn-primary" onClick={submitData}>Soumettre</button>
//  </>)
//  
//  //return (<>
//  //  <div>
//  //    <h2 style={{textAlign: 'center'}}>Entraîner: {filter.name}</h2>
//  //    <div className="over-container" style={{margin: "auto"}}>
//  //      <img src={record.image_id ? image_variant_path(record.image_id, "medium") : "/default_recipe_01.png"} style={{maxWidth: "100vw"}} width="452" height="304" />
//  //      <h2 className="bottom-center font-satisfy" style={{borderRadius: "0.5em", border: "1px solid #777", color: "#333", bottom: "1em", backgroundColor: "#f5f5f5", fontSize: "2em", padding: "0.2em 0.8em 0 0.2em"}}>{record.name}</h2>
//  //    </div>
//  //    <div>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>1</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>2</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>3</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>4</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>5</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>6</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>7</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>8</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>9</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>10</button>
//  //    </div>
//  //  </div>
//  //</>)
//}
//
