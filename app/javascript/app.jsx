import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Hammer from "react-hammerjs"
//var windowHistory = window.history // window.history.back() => same as back in browser
//import history from 'history/hash'

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useCacheOrFetch, useCacheOrFetchHTML, useWindowWidth, LinkToPage, useUpdatableState, getStateProperties, register, getRegister, useRegisteredState } from "./lib"
import {RecipeIndex} from './recipe_index'
import { ajax, isBlank, preloadImage, getUrlParams, join, bindSetter, sortBy, capitalize } from "./utils"
import { icon_path, recipe_kind_path, suggestions_path, image_variant_path, send_data_suggestions_path, batch_update_filtered_recipes_path, batch_create_filtered_recipes_path, batch_destroy_filtered_recipes_path, recipe_filters_path, recipe_filter_path, missing_filtered_recipes_path, user_recipes_recipes_path, new_recipe_path, new_book_path, user_books_books_path, my_books_path, all_recipe_kinds_recipe_filters_path, recipe_path, user_tags_path, user_tag_path, containers_path, grocery_list_path, calendar_path, inventory_path, mixes_path, mix_path, inline_recipe_path, recipe_recipe_ingredients_path } from './routes'
import {TextField, AutocompleteInput, TextInput, CollectionSelect} from './form'
import {PublicImageField} from './modals/public_image'
import { DeleteConfirmButton } from './components/delete_confirm_button'
import {AddUserTagModal} from './modals/add_user_tag'
import {RecipeEditor} from "./recipe_editor"

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
const PAGE_14 = 14 // EditMix
const PAGE_15 = 15 // ShowRecipe
const PAGE_16 = 16 // EditRecipe
const PAGE_17 = 17
const PAGE_18 = 18
const PAGE_19 = 19
const PAGE_20 = 20

const changePage = (page) => {
  getRegister('setPage')(page)
}
  
const encodeRecord = (record) => (`${record.class_name == "recipe_kind" ? '' : '_'}${record.id}`)

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
          <img src={suggestion.image_id ? image_variant_path({id: suggestion.image_id}, "medium") : "/default_recipe_01.png"} style={{maxWidth: "100vw"}} width="452" height="304" />
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

const TagSuggestions = ({tags, suggestions, page}) => {

  const tag = tags.find(f => f.id == page.filterId)
  if (!tag) {return ''}

  const tagSuggestions = suggestions.filter(suggestion => suggestion.filter_id == tag.id)

  return (<>
    <SuggestionsNav {...{page, tagSuggestions}} />
    {tag.name ? <h2 style={{textAlign: 'center'}}>{tag.name}</h2> : ''}
    <RecipeSingleCarrousel tag={tag} suggestions={tagSuggestions}/>
  </>)
}

const TagCategorySuggestions = ({page, recipeFilters, suggestions}) => {

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
    <SuggestionsNav {...{page, tagSuggestions, categorySuggestions}} />
    {tag.name ? <h2 style={{textAlign: 'center'}}>{tag.name}</h2> : ''}
    <RecipeSingleCarrousel tag={tag} suggestions={categorySuggestions} isCategory={true} />
  </>)
}

              //return (<td key={j}>
              //  <div className="over-container clickable" style={{margin: "auto", border: `4px solid ${selected[nb] ? 'blue' : 'white'}`}} onClick={() => imageClicked(nb)}>
//    <img src={record.image_id ? image_variant_path({id: record.image_id}, "small") : "/default_recipe_01.png"} width="255" height="171" />
              //    <h2 className="bottom-center font-satisfy" style={{borderRadius: "0.5em", border: "1px solid #777", color: "#333", bottom: "1em", backgroundColor: "#f5f5f5", fontSize: "1.2em", padding: "0.2em 0.8em 0 0.2em"}}>{record.name}</h2>
              //  </div>
              //</td>)
const RecipeImageWithTitle = ({record, selected, selectItem}) => {
  return <div className="over-container clickable d-inline-block" style={{border: `4px solid ${selected ? 'blue' : 'white'}`}} onClick={() => selectItem(record)}>
    <img src={record.image_id ? image_variant_path({id: record.image_id}, "small") : "/default_recipe_01.png"} width="255" height="171" style={{maxWidth: "100vw"}} />
    <h2 className="bottom-center font-satisfy" style={{borderRadius: "0.5em", border: "1px solid #777", color: "#333", bottom: "1em", backgroundColor: "#f5f5f5", fontSize: "1.2em", padding: "0.2em 0.8em 0 0.2em"}}>{record.name}</h2>
  </div>
}

const TagEditAllCategories = ({page, recipeFilters}) => {
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

const EditFilter = ({page, recipeFilters}) => {
  const [name, setName] = useState('')
  const filter = page && page.filterId ? recipeFilters.find(f => f.id == page.filterId) : null
  if (!filter) {console.log("Can't edit filter, did not exist."); return '';}

  return (<>
    <h2>Modifier le filtre</h2>
    <h3>Titre</h3>
    <TextField model={filter} field="name" url={recipe_filter_path(filter)} getter={recipeFilters} setter={recipeFilters.update} />
    <h3>Image</h3>
    <PublicImageField model={filter} field="image_src" defaultSrc={"question-mark.jpg"} url={recipe_filter_path(filter)} getter={recipeFilters} setter={recipeFilters.update} />
    <br/>
    <div>
      <button type="button" className="btn btn-primary" onClick={() => {}}>Modifier les recettes correspondantes (not implemented yet)</button>
    </div>
    <br/>
    <div>
      <button type="button" className="btn btn-primary" onClick={() => changePage({page: 8, filterId: filter.id})}>Modifier les catégories correspondantes</button>
    </div>
  </>)
}

const EditUserTags = ({userTags, recipeFilters, page}) => {

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
            <span className="cursor-pointer" onClick={() => changePage({page: 3, filterId: tag.id})}>{tag.name || "Sans nom"}</span>
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
const TagIndex = ({page, machines, recipeFilters, addRecipeFilter, userTags}) => {

  const winWidth = useWindowWidth()

  const buttons = userTags.map(userTag => {
    let tag = recipeFilters.find(t => t.id == userTag.tag_id)
    return <TagButton key={userTag.id} winWidth={winWidth} image={`/img/${tag.image_src || "question-mark.jpg"}`} title={tag.name || "Sans nom"} handleClick={() => changePage({page: PAGE_9, filterId: tag.id})} />
  })

  const machineButtons = machines.map(machine => {
    return <TagButton key={`machine-${machine.id}`} winWidth={winWidth} image='/img/robot.jpg' title={machine.name || "Heda"} handleClick={() => changePage({page: PAGE_10, machineId: machine.id})} />
  })

  // Pour recevoir des invités => (page suivantes, quelles restrictions => véganes)
  return (<>
    <div style={{maxWidth: "100vw", width: "400px", margin: "auto"}}>
      <TagButton winWidth={winWidth} image="/img/cooking.jpg" title="Mes recettes" handleClick={() => changePage({page: PAGE_6})} />
      <TagButton winWidth={winWidth} image="/img/recipes.jpg" title="Mes livres" handleClick={() => {window.location.href = my_books_path()}} />
      {machineButtons}
      {buttons}
      <TagButton winWidth={winWidth} image="/icons/gear-gray.svg" title="Paramètres" handleClick={() => changePage({page: PAGE_4})} />
    </div>
  </>)
}

// I do something similar to Tiptap to serialize and deserialize
const CmdAdd = {
  id: 'ADD',
  label: {
    fr: 'AJOUTER'
  },
  args: [ // unused
    {name: 'qty', type: 'STRING'},
    {name: 'food', type: 'REFERENCE'}, // 'idNumber-name'
  ],
  // ADD,qty,machineFoodId,foodName
  parse: (args, context, obj={}) => {
    obj.qty = args[1]
    if (args[2]) {
      let i = args[2].indexOf('-')
      obj.machineFoodId = (i == -1) ? null : args[2].substr(0,i)
      obj.machineFoodName = (i == -1) ? args[2] : args[2].substr(i+1)
      obj.machineFood = context.machineFoods.find(e => e.id == obj.machineFoodId)
    }
    if (!obj.machineFood) {
      obj.errors = [`Unable to find food with name = ${args[2]}`]
    }
    return obj
  },
  print: (obj) => {
      return <div className="instruction"><span>{obj.type.label.fr}</span><span>{obj.qty}</span><span>{obj.machineFoodName}</span></div>
  },
}
const CmdMix = {
  id: 'MIX',
  label: {
    fr: 'MÉLANGER'
  },
  parse: (args, context, obj={}) => {
    return obj
  },
  print: (obj) => {
    return <div className="instruction"><span>{obj.type.label.fr}</span></div>
  },
}
const CmdContainer = {
  id: 'CONTAINER',
  label: {
    fr: 'CONTENANT'
  },
  args: [ // unused
    {name: 'id', type: 'STRING'},
  ],
  parse: (args, context, obj={}) => {
    obj.id = args[1]
    return obj
  },
  print: (obj) => {
    return <div className="instruction"><span>{obj.type.label.fr}</span><span>{obj.id}</span></div>
  },
}

const CMD_TYPES = [CmdAdd, CmdMix, CmdContainer]
const labelForCmdType = (cmdType) => {
  let t = CMD_TYPES.find(e => e.id == cmdType.id)
  return t ? t.label.fr : cmdType.id
}

export const EditMix = ({page, recipes, favoriteRecipes, machines, mixes, machineFoods}) => {

  const context = {recipes, favoriteRecipes, machines, mixes, machineFoods}

  const machine = page.machineId ? machines.find(m => m.id == page.machineId) : null
  const currentMachineFoods = machine ? machineFoods.filter(m => m.machine_id == machine.id) : machineFoods
  const mix = page.recipeId ? mixes.find(m => m.recipe_id == page.recipeId) : mixes.find(m => m.id == page.mixId)
  console.log('edit mix', mix)

  if (!mix) { return '' }

  //const recipeHTML = useCacheOrFetchHTML(inline_recipe_path({id: mix.recipe_id}), {waitFor: mix.recipe_id})

  const update = () => {
    console.log('UPDATING')
    ajax({url: mix_path(mix), type: 'PATCH', data: {mix: {recipe_id: mix.recipe_id, name: mix.name, instructions: mix.instructions}}, success: (mix) => {
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
  const removeInstruction = (line) => {
    let e = [...instructions]
    e.splice(line, 1)
    mix.instructions = e.join(';'); update()
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
    console.log('calling update 01'); update()
  }
  const handleDrop = ({source, destination, type, draggableId}) => {
    if (!destination) return; // Ignore drop outside droppable container
    
    var updatedList = [...instructions];
    const [reorderedItem] = updatedList.splice(source.index, 1);
    updatedList.splice(destination.index, 0, reorderedItem);

    mix.instructions = updatedList.join(';')
    update()
  }
  const moveMixAddToIng = (obj, line) => {
    let data = {recipe_ingredient: {
      raw: obj.qty,
      raw_food: obj.machineFoodName
    }}
    ajax({url: recipe_recipe_ingredients_path(gon.recipe), type: 'POST', data: data, success: (ingredient) => {
      window.recipe_editor.current.addIng(ingredient)
      removeInstruction(line)
    }})
  }

  const eInstructions = instructions.map((instruction,line) => {

    let args = instruction.split(',')
    let cmd = args[0]

    let cmdType = CMD_TYPES.find(e => e.id == cmd)
    let obj = cmdType ? cmdType.parse(args, context) : null
    if (obj) {obj.type = cmdType}

    let eArgs = ''
    if (obj && obj.type.id == "ADD") {
      eArgs = (<>
        <TextInput defaultValue={obj.qty} onBlur={(qty) => updateArg(1, qty, line)} />
        <AutocompleteInput name="food" choices={currentMachineFoods} defaultValue={obj.machineFoodName}
          onSelect={(e, term, item) => {
            f = currentMachineFoods.find(e => e.id == item.dataset.id);
            updateArg(2, `${item.dataset.id}-${f ? f.name : ''}`, line)
          }} onBlur={(name) => {
            f = currentMachineFoods.find(e => e.name  == name);
            updateArg(2, `${f ? f.id : ''}-${name}`, line)
          }} minChars={0}
        />
      </>)
    } else if (obj && obj.type.id == "CONTAINER") {
      eArgs = (<>
        <TextInput defaultValue={obj.id} onBlur={(id) => updateArg(1, id, line)} />
      </>)
    }

    return (
      <Draggable key={`drag-instruction-${line}-${args}`} draggableId={`drag-instruction-${line}-${args}`} index={line}>
        {(provided) => (<>
          <div className="item-container" ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
            <li key={`${line}-${instruction}`} className={`list-group-item${!obj || obj.errors ? ' cmd-error' : ''}`}>
              <img className="clickable float-end" style={{marginTop: '0.4em'}} src="/icons/x-lg.svg" width="18" height="18" onClick={() => removeInstruction(line)}></img>
              {(obj && obj.type.id == "ADD") ? <img className="clickable float-end" style={{marginRight: '0.4em', marginTop: '0.4em'}} src="/icons/arrow-down-up.svg" width="18" height="18" onClick={() => moveMixAddToIng(obj, line)}></img> : ''}
    
              {!obj || obj.errors ? <img className="float-end" style={{marginRight: '0.6em', marginTop: '0.4em'}} src="/icons/info-circle.svg" width="18" height="18"></img> : ''}
              <div className='d-flex gap-10'>
                <div className="dropdown">
                  <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {obj ? obj.type.label.fr : cmd}
                  </button>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {CMD_TYPES.filter(e => e != cmd).map((cmdType,i) => (
                      <span key={i} className="dropdown-item" onClick={() => changeInstruction(cmdType.id, line)}>
                        {labelForCmdType(cmdType)}
                      </span>
                    ))}
                  </div>
                </div>
                {eArgs}
              </div>
            </li>
          </div>
        </>)}
      </Draggable>
    )
  })

  const recipeIds = favoriteRecipes.map(r => r.recipe_id).concat(recipes.map(r => r.id))
  const recipeNames = {}
  favoriteRecipes.forEach(r => {recipeNames[r.recipe_id] = r.name})
  recipes.forEach(r => {recipeNames[r.id] = r.name})
    
  //  <br/><br/>
  //  <h2>Recette</h2>
  //  <h3>Lier avec une recette existante:</h3>
  //  <CollectionSelect model={mix} field="recipe_id" options={recipeIds} showOption={(id) => recipeNames[id]} includeBlank="true" onChange={id => {mix.recipe_id = id; update()}} />
  //  <h3>Lier en clonant une recette existante:</h3>
  //  <h3>Créer une nouvelle recette:</h3>
  //  <h3>Aperçu</h3>
  //  {recipeHTML ? <div dangerouslySetInnerHTML={{__html: recipeHTML}} /> : ''}

  return (<>
    <h1 contentEditable suppressContentEditableWarning={true} onBlur={(e) => {updateName(e.target.innerText)}}>
      {mix.name || 'Sans nom'}
    </h1>
    <h2>Commandes</h2>
    <DragDropContext onDragEnd={handleDrop}>
      <Droppable droppableId="instructions-container">
        {(provided) => (<>
          <div className="instructions-container" {...provided.droppableProps} ref={provided.innerRef}>
            <ul className="list-group">{eInstructions}</ul>
            {provided.placeholder}
          </div>
        </>)}
      </Droppable>
    </DragDropContext>
    <div style={{height: '0.5em'}}></div>
    <img className="clickable" src="/icons/plus-circle.svg" width="24" height="24" onClick={addInstruction}></img>
  </>)
}

const ShowRecipe = ({page}) => {
  const recipeHTML = useCacheOrFetchHTML(inline_recipe_path({id: page.recipeId}), {waitFor: page.recipeId})
  return recipeHTML ? <div dangerouslySetInnerHTML={{__html: recipeHTML}} /> : ''
}

const EditRecipe = ({page, favoriteRecipes, machines, mixes, machineFoods, recipes, foods}) => {
  
  const recipe = recipes.find(e => e.id == page.recipeId)

  window.recipe_editor = useRef(null) // FIXME: This is really ugly
  gon.recipe = recipe // FIXME: This is really ugly
  return <RecipeEditor {...{page, favoriteRecipes, machines, mixes, machineFoods, foods}} ref={window.recipe_editor}/>
}
  
const ShowMix = ({page, recipes, favoriteRecipes, machines, mixes, machineFoods}) => {

  const machine = page.machineId ? machines.find(m => m.id == page.machineId) : null
  const currentMachineFoods = machine ? machineFoods.filter(m => m.machine_id == machine.id) : machineFoods
  const mix = mixes.find(m => m.id == page.mixId)

  console.log('mix.recipe_id', mix.recipe_id)
  const recipeHTML = useCacheOrFetchHTML(inline_recipe_path({id: mix.recipe_id}), {waitFor: mix.recipe_id})

  const instructions = (mix.instructions||'').split(';')
  const eInstructions = instructions.map((instruction,line) => {

    let args = instruction.split(',')
    let cmdType = CMD_TYPES.find(e => e.id == args[0])
    let obj = cmdType ? cmdType.parse(args, context) : null
    if (obj) {obj.type = cmdType}

    return (
      <li key={`${line}-${instruction}`} className={`list-group-item${!obj || obj.errors ? ' cmd-error' : ''}`}>
        {!obj || obj.errors ? <img className="float-end" style={{marginRight: '0.4em', marginTop: '0.4em'}} src="/icons/info-circle.svg" width="18" height="18"></img> : ''}
        <div className='d-flex gap-10'>
          {obj ? cmdType.print(obj) : ''}
        </div>
      </li>
    )
  })

  return (<>
    <div className="d-flex gap-20 align-items-center">
      <h1>{mix.name || 'Sans nom'}</h1>
      <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => changePage({page: PAGE_14, machineId: machine.id, mixId: mix.id})}>Modifier</button>
    </div>
    <ul className="list-group">{eInstructions}</ul>
    <div style={{height: '0.5em'}}></div>
    <div className="d-flex gap-10">
      <button type="button" className="btn btn-small btn-primary">Cuisiner</button>
      <button type="button" className="btn btn-small btn-secondary">Ajouter à mon calendrier</button>
    </div>
    <div style={{height: '1em'}}></div>
    {recipeHTML ? <div dangerouslySetInnerHTML={{__html: recipeHTML}} /> : ''}
  </>)
}

const MixIndex = ({page, machines, mixes, machineFoods}) => {

  const machine = machines.find(m => m.id == page.machineId)
  const currentMachineFoods = machineFoods.filter(m => m.machine_id == page.machineId)

  const createMix = () => {
    ajax({url: mixes_path(), type: 'POST', data: {}, success: (mix) => {
      mixes.update([...mixes, mix])
      changePage({page: PAGE_14, machineId: machine.id, mixId: mix.id})
    }})
  }
  const destroyMix = (mix) => {
    ajax({url: mix_path(mix), type: 'DELETE', success: () => {
      mixes.update(mixes.filter(e => e.id != mix.id))
    }})
  }

  const sorted = sortBy(mixes, "name") // Sorting client side so newly created are sorted
  const eMixes = sorted.map(mix => {
    return <li key={mix.id} className="list-group-item">
      <span className="clickable" onClick={() => changePage({page: PAGE_13, machineId: machine.id, mixId: mix.id})}>{mix.name || 'Sans nom'}</span>
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

const Inventory = ({page, machines, containerQuantities, machineFoods}) => {

  const machine = machines.find(m => m.id == page.machineId)
  const currentMachineFoods = machineFoods.filter(m => m.machine_id == page.machineId)

  const items = currentMachineFoods.map(machineFood => {
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
      <TagButton winWidth={winWidth} image="/img/blender.jpg" title="Mélanges" handleClick={() => changePage({page: PAGE_12, machineId: machine.id})} />
      <TagButton winWidth={winWidth} image="/img/bar_code.jpg" title="Inventaire" handleClick={() => changePage({page: PAGE_11, machineId: machine.id})} />
    
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

const useTransition = (initial, current, final) => {
  const [state, setState] = useState(initial)

  useEffect(() => {
    setState(final)
  }, [current])

  return state
}

const SearchBox = ({shown}) => {
  const height = useTransition('0', shown ? '100vh' : '0', '100vh')
  if (!shown) {return ''}
  return (<>
    <div style={{height: height, backgroundColor: '#cff', transition: 'height 1s'}}>
      <h2>Rechercher</h2>
    </div>
  </>)
}

const MyRecipes = ({page, suggestions, tags, favoriteRecipes, recipes, mixes}) => {

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
    <RecipeIndex page={page} favoriteRecipes={favoriteRecipes} loading={false} suggestions={suggestions} tags={tags} mixes={mixes} recipes={recipes} />
  </>)
}

const App = () => {
  
  const page = useRegisteredState('page', getUrlParams(), (updated) => {
    let s = getStateProperties(updated)
    window.history.replaceState(s, '', '?'+new URLSearchParams(s).toString())
  })

  const recipeFilters = useUpdatableState('recipeFilters', gon.recipe_filters)
  const suggestions = useUpdatableState('suggestions', gon.suggestions)
  const userTags = useUpdatableState('userTags', gon.user_tags)
  const favoriteRecipes = useUpdatableState('favoriteRecipes', gon.favorite_recipes)
  const machines = useUpdatableState('machines', gon.machines)
  const machineFoods = useUpdatableState('machineFoods', gon.machine_foods)
  const containerQuantities = useUpdatableState('containerQuantities', gon.container_quantities)
  const mixes = useUpdatableState('mixes', gon.mixes)
  const foods = useUpdatableState('foods', gon.foods)
  const recipes = useUpdatableState('recipes', gon.recipes)

  const all = {page, recipeFilters, suggestions, userTags, favoriteRecipes, machines, machineFoods, containerQuantities, mixes, recipes, foods}

  const [isSearching, setIsSearching] = useState(false)

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
    [PAGE_14]: PAGE_13,
    [PAGE_15]: PAGE_6,
    [PAGE_16]: PAGE_15,
  }

  const pages = {
    [PAGE_1]: <TagIndex {...{page, recipeFilters, userTags, machines}} addRecipeFilter={(filter) => recipeFilters.update(recipeFilters.concat([filter]))} />,
    [PAGE_2]: <TagCategorySuggestions {...{page, recipeFilters, suggestions}} />,
    [PAGE_3]: <EditFilter page={page} recipeFilters={recipeFilters} />,
    [PAGE_4]: <EditUserTags recipeFilters={recipeFilters}userTags={userTags} page={page} />,
    //5: <TrainFilter page={page} recipeFilters={recipeFilters} />,
    [PAGE_6]: <MyRecipes {...{page, recipes, suggestions, recipeFilters, favoriteRecipes, tags: recipeFilters, mixes}} />,
    [PAGE_7]: <MyBooks page={page} />,
    [PAGE_8]: <TagEditAllCategories page={page} recipeFilters={recipeFilters} />,
    [PAGE_9]: <TagSuggestions page={page} suggestions={suggestions} tags={recipeFilters} />,
    [PAGE_10]: <HedaIndex {...{page, machines}} />,
    [PAGE_11]: <Inventory {...{page, machines, machineFoods, containerQuantities}} />,
    [PAGE_12]: <MixIndex {...{page, machines, machineFoods, mixes}} />,
    [PAGE_13]: <ShowMix {...all} />,
    [PAGE_14]: <EditMix {...all} />,
    [PAGE_15]: <ShowRecipe {...all} />,
    [PAGE_16]: <EditRecipe {...all} />,
  }

  // I don't want a back system, I want a up system. So if you are given a nested link, you can go up.
  const goUp = () => {
    if (page.page && parentPages[page.page]) {
      changePage({...getStateProperties(page), page: parentPages[page.page]})
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
      <h1 style={{marginBottom: "0"}} className="clickable" onClick={() => changePage(1)}>Qu'est-ce qu'on mange?</h1>
      <div className="flex-grow-1"/>
      <img className="clickable" src={icon_path("search_black.svg")} width="24" onClick={() => {setIsSearching(!isSearching)}}/>
    </div>
    <hr style={{color: "#aaa", marginTop: "0"}}/>
    <SearchBox shown={isSearching}/>
    {pages[page.page || 1]}
  </>)
}

document.addEventListener('DOMContentLoaded', () => {

  const root = document.getElementById('app')
  if (root) {ReactDOM.render(<App/>, root)}
})
