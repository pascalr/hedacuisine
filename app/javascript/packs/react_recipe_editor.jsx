import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Autosuggest from 'react-autosuggest'

import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'

import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import Quantity from 'models/quantity'
import { Ingredient, Utils } from "recipe_utils"

import { Tiptap, BubbleTiptap, ModificationsHandler } from 'tiptap'
import '../styles/prose_mirror.scss'


function updateIngQuantityCallback() {
}

function updateListOrder() {
}

const InstructionsShortcuts = props => (
  <>
    <button type="button" className="btn btn-small dropdown-toggle" data-bs-toggle="collapse" data-bs-target="#show-shortcuts">
      Voir les racourcis claviers
    </button>
    <div className="collapse" id="show-shortcuts">
      <h2>Racourcis claviers</h2>
      <ul>
        <li><b>#</b>: Commencer une ligne avec «#» pour chaque étape de la recette.</li>
        <li><b>$</b>: Commencer une ligne avec «$» pour un grand titre.</li>
        <li><b>$$</b>: Commencer une ligne avec «$$» pour un moyen titre.</li>
        <li><b>$$$</b>: Commencer une ligne avec «$$$» pour un petit titre.</li>
        <li><b>/</b>: Commencer une ligne avec «/» pour faire un paragraph en italique.</li>
        <li><b>{"{3}"}</b>: Afficher l'ingrédient 3</li>
        <li><b>{"{3-5}"}</b>: Afficher les ingrédients 3, 4 et 5</li>
        <li><b>{"{3,5}"}</b>: Afficher les ingrédients 3 et 5</li>
        <li><b>{"{3;}"}</b>: TODO: Afficher le nombre 3 qui scale avec la recette</li>
        <li><b>{"{3;pomme}"}</b>: TODO: Afficher la quantité 3 pomme qui scale avec la recette</li>
        <li><b>{"{2;pomme,3-5}"}</b>: TODO: Afficher la quantité 3 pomme qui scale avec la recette et les ingrédients 3, 4 et 5.</li>
        <li><b>[1]</b>: TODO: Lien vers la note 1</li>
        <li><b>[1;Section name]</b>: TODO: Lien vers la section de l'article</li>
        <li><b>[note: 1]</b></li>
        <li><b>[link_note: 1]</b></li>
        <li><b>[recipe: 100]</b></li>
        <li><b>[food: 100]</b></li>
        <li><b>[url: "http://www.hedacuisine.com/"]</b></li>
        <li><b>[label: "home", url: "http://www.hedacuisine.com/"]</b></li>
        <li><b>[img: 10]</b></li>
      </ul>
    </div>
  </>
)

const NewIngInputField = props => {

  const [value, setValue] = useState('')
  const [qty, setQty] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [newlyAdded, setNewlyAdded] = useState(true);

  //const foodInputField = useRef(null);
  const quantityInputField = useRef(null);

  useEffect(() => {
    if (newlyAdded) {
      quantityInputField.current.focus()
      setNewlyAdded(false)
    }
  }, [newlyAdded]);

  const inputFieldProps = {
    placeholder: 'Sélectionner un aliment',
    value,
    onChange: (e, {newValue}) => setValue(newValue),
    //ref: foodInputField,
  };

  const addIngredient = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    let data = new FormData()
    data.append('recipe_ingredient[raw]', qty)
    data.append('recipe_ingredient[food_id]', suggestion.id)
    Rails.ajax({url: gon.recipe.new_ingredient_url, type: 'POST', data: data, success: (raw) => {
      const response = JSON.parse(raw)
      //gon.recipe.ingredients.push({url: response.url, food: {name: response.food_name, url: response.food_url}})
      if (!gon.recipe.ingredients) {gon.recipe.ingredients = {}}
      gon.recipe.ingredients[response.id] = response
      window.recipe_editor.current.addIng(response.id)
      setValue(''); setQty('');
      quantityInputField.current.focus()
    }})
  }

  return (
    <Row gap="7px" align-items="flex-start">
      <input type="text" size="8" style={{border: "none", borderBottom: "1px dashed #444"}} value={qty} onChange={(e) => setQty(e.target.value)} ref={quantityInputField} />
      de
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={({value}) => {
          const inputValue = value.trim().toLowerCase();
          const inputLength = inputValue.length;
         
          const matched = inputLength === 0 ? [] : gon.foodList.filter(food =>
            food.name.includes(inputValue)
          )
          // Order the matches by relevance?
          setSuggestions(matched)
        }}
        onSuggestionsClearRequested={() => setSuggestions([])}
        getSuggestionValue={suggestion => suggestion.name}
        renderSuggestion={(suggestion, { isHighlighted }) => (
          <div style={{ background: isHighlighted ? '#4095bf' : 'white', color: isHighlighted ? 'white' : 'black' }}>
            {suggestion.name}
          </div>
        )}
        onSuggestionSelected={addIngredient}
        inputProps={inputFieldProps}
      />
    </Row>
  )
}

const VisualState = {
  CLOSED: 1,
  EXPANDING: 2,
  EXPANDED: 3,
}

// props: {comment}
const EditableIngredientComment = (props) => {

  //const [comment, setComment] = useState(props.comment);
  const [visual, setVisual] = useState(props.comment && props.comment != '' ? VisualState.EXPANDED : VisualState.CLOSED);

  //const commentInput = useRef(null);

  useEffect(() => {
    if (visual == VisualState.EXPANDING) {
      setVisual(VisualState.EXPANDED)
      //commentInput.current.focus()
    }
  }, [visual]);

  //const updateComment = () => {
  //  if (comment != props.comment) {
  //    let data = new FormData()
  //    data.append('recipe_ingredient[comment]', comment)
  //    Rails.ajax({url: props.ingUrl, type: 'PATCH', data: data})
  //  }
  //  if (!comment || comment == '') {
  //    setVisual(VisualState.CLOSED)
  //  }
  //}

  const closeIfEmpty = () => {
  }

  if (visual == VisualState.CLOSED) {
    return (
      <button type="button" className="btn-image" onClick={() => setVisual(VisualState.EXPANDING)}>
        <img src="/icons/chat-left.svg" style={{marginLeft: "10px"}}/>
      </button>
    )
  } else {
    const style = {transition: "width 0.4s ease-in-out"}
    style.width = visual == VisualState.EXPANDED ? "200px" : "0px"
    return (
      <Row marginLeft="10px" style={style} onBlur={closeIfEmpty}>
        <BubbleTiptap content={props.comment} model="recipe_ingredient" field="comment" url={props.ingUrl}/>
      </Row>
    )
    //(<input type="text" value={comment || ''} style={style} ref={commentInput} onChange={(e) => setComment(e.target.value)} onBlur={updateComment} />)
  }
}

const DeleteConfirmButton = ({id, onDeleteConfirm, message}) => {

  // For popover. See https://mui.com/components/popover/
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (<>
    <button type="button" aria-describedby={`delete-popover-${id}`} className="plain-btn" onClick={(evt) => setAnchorEl(evt.currentTarget)}>
      <img src="/icons/x-lg.svg"/>
    </button>
    <Popover
      id={`delete-popover-${id}`}
      open={anchorEl != null}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      transformOrigin={{vertical: 'bottom', horizontal: 'right'}}
    >
      <Typography sx={{ p: 2 }}>
        {message}
        <button type="button" className="btn btn-primary" style={{marginLeft: "10px"}} onClick={onDeleteConfirm}>Oui</button>
      </Typography>
    </Popover>
  </>)
}

const EditableIngredient = (props) => {

  const ing = gon.recipe.ingredients[props.objId]
  if (ing == null) {return null;}

  const removeIngredient = (evt) => {
    Rails.ajax({url: ing.url, type: 'DELETE', success: (raw) => {
      window.recipe_editor.current.removeIng(ing.id)
      delete gon.recipe.ingredients[ing.id]
    }})
  }

  return (
    <Row alignItems="center" gap="5px">
      <span style={{padding: "0 10px 0 0"}}><b>{props.position}.</b></span>
      <input onBlur={updateIngQuantityCallback} type="text" size="8" defaultValue={ing.raw} style={{border: "none", borderBottom: "1px dashed #444"}} />
      de{/*" de " ou bien " - " si la quantité n'a pas d'unité => _1_____ - oeuf*/}
      <a href={ing.food.url}>{ing.food.name}</a>
      <EditableIngredientComment ingUrl={ing.url} comment={ing.comment} />
      <Block flexGrow="1" />
      <DeleteConfirmButton id={`ing-${ing.id}`} onDeleteConfirm={removeIngredient} message="Je veux enlever cet ingrédient?" />
    </Row>
  )
  //<a href={ing.url} data-confirm="Are you sure?" data-method="delete"><img src="/icons/x-lg.svg" style={{float: "right"}}/></a>
}

class Model {
  constructor(name, data) {
    this.name = name
    this.data = data
  }
  currentValue(field) {
    return this.data[field]
  }
  fieldName(field) {
    return this.name+"["+field+"]"
  }
  updateValue = (field, value, successCallback=null) => {
    if (value != this.currentValue(field)) {
  
      let data = new FormData()
      data.append(this.fieldName(field), value)
      Rails.ajax({url: this.data.url+".js", type: 'PATCH', data: data, success: () => {
        this.data[field] = value
        if (successCallback) {successCallback()}
      }, error: (errors) => {
        toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
      }})
    }
  }
}
//const RECIPE_MODEL = new Model("recipe")

const TextInputField2 = ({model, field}) => {
  const [value, setValue] = useState(model.currentValue(field))

  return (
    <input type="text" value={value||''} name={model.fieldName(field)} style={{border: "none"}}
      id={field} onChange={(e) => setValue(e.target.value)}
      onBlur={() => model.updateValue(field, value)} />
  )
}

const TextInputField = ({model, field}) => {
  const [value, setValue] = useState(model.currentValue(field))

  return (
    <div className="field">
      <b><label htmlFor={field}>{field}</label></b>{': '}
      <input type="text" value={value||''} name={model.fieldName(field)} style={{border: "none", borderBottom: "1px dashed #444"}} id={field}
        onChange={(e) => setValue(e.target.value)} onBlur={() => model.updateValue(field, value)} />
    </div>
  )
}

const TextAreaField = ({model, field, cols, rows, changeCallback=null}) => {
  const [value, setValue] = useState(model.currentValue(field))

  return (
    <div className="field">
      <textarea value={value||''} name={model.fieldName(field)} id={field} cols={cols} rows={rows} onChange={(e) => {
        setValue(e.target.value);
        if(changeCallback) {changeCallback(e.target.value)}
      }} onBlur={() => model.updateValue(field, value)} />
    </div>
  )
}

const CollectionSelect2 = ({model, field, options, showOption, includeBlank}) => {
  const [value, setValue] = useState(model.currentValue(field))

  const updateField = (e) => {
    let val = e.target.value
    model.updateValue(field, val, () => setValue(val))
  }

  return (
    <select name={model.fieldName(field)} id={field} value={value||''} onChange={updateField}>
      {includeBlank ? <option value="" key="1" label=" "></option> : null}
      {options.map((opt, i) => {
        return <option value={opt} key={i+2}>{showOption(opt)}</option>
      })}
    </select>
  )
}
const CollectionSelect = ({model, field, options, showOption, includeBlank}) => {
  const [value, setValue] = useState(model.currentValue(field))

  const updateField = (e) => {
    let val = e.target.value
    model.updateValue(field, val, () => setValue(val))
  }

  return (
    <div className="field">
      <b><label htmlFor={field}>{field}</label></b>{': '}
      <select name={model.fieldName(field)} id={field} value={value||''} onChange={updateField}>
        {includeBlank ? <option value="" key="1" label=" "></option> : null}
        {options.map((opt, i) => {
          return <option value={opt} key={i+2}>{showOption(opt)}</option>
        })}
      </select>
    </div>
  )
}

const Toggleable = ({children, ...props}) => {
  const [showToggled, setShowToggled] = useState(false)

  if (children.length <= 1) {throw "Toggleable requires 2 or 3 children. The first is the toggled. The second is the toggler. The third, if present, is the toggler active."}

  // TODO: Allow to be a div or link instead of a button? Who cares for now.
  return (<div {...props}>
    {showToggled ? children[0] : null}
    <button className="plain-btn" onClick={() => setShowToggled(!showToggled)}>
      {!showToggled ? children[1] : (children.length >= 2 ? children[2] : children[1])}
    </button>
  </div>)
}

class RecipeEditor extends React.Component {
  
  constructor(props) {
    super(props);
    let ingIds = gon.recipe.ingredients ? Object.values(gon.recipe.ingredients).sort((a,b) => a.item_nb - b.item_nb).map(ing => ing.id) : []
    let noteIds = gon.recipe.notes ? Object.values(gon.recipe.notes).sort((a,b) => a.item_nb - b.item_nb).map(ing => ing.id) : []
    this.state = {
      name: gon.recipe.name,
      ingIds: ingIds,
      noteIds: noteIds,
      toolIds: Object.keys(gon.recipe.tools),
      instructionsSlave: gon.recipe.complete_instructions,
    };
    this.handleDropIng = this.handleDropIng.bind(this);
    this.updateName = this.updateName.bind(this);
  }

  //swapIng(dragIndex, dropIndex) {
  //  let swappedIngs = swapArrayPositions(this.state.ings, dragIndex, dropIndex);
  //  this.setState({ings: swappedIngs})
  //}

  addIng(id) {
    this.setState({ingIds: [...this.state.ingIds, id]})
  }
  removeIng(id) {
    let ids = this.state.ingIds.filter(item => item != id)
    this.setState({ingIds: ids})
  }

  updateName() {
    if (this.name == gon.recipe.name) {return;}
    let data = new FormData()
    data.append('recipe[name]', this.state.name)
    Rails.ajax({url: gon.recipe.url, type: 'PATCH', data: data})
  }
  
  appendNote() {
    let data = new FormData()
    data.append('recipe_note[content]', '')
    Rails.ajax({url: gon.recipe.new_note_url, type: 'POST', data: data, success: (raw) => {
      const response = JSON.parse(raw)
      if (!gon.recipe.notes) {gon.recipe.notes = {}}
      gon.recipe.notes[response.id] = response
      this.setState({noteIds: [...this.state.noteIds, response.id]})
    }})
  }

  handleDropIng(droppedItem) {
    console.log('Handle drop ing')
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    var updatedList = [...this.state.ingIds];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);

    console.log(droppedItem)

    let data = new FormData()
    data.append('ing_id', droppedItem.draggableId)
    data.append('position', droppedItem.destination.index+1)
    Rails.ajax({url: gon.recipe.move_ing_url, type: 'PATCH', data: data})
    this.setState({ingIds: updatedList})
  }

  render() {

    const IngredientList = 
      <ul className="list-group" style={{maxWidth: "800px"}}>
        <DragDropContext onDragEnd={this.handleDropIng}>
          <Droppable droppableId="list-container">
            {(provided) => (
              <div className="list-container" {...provided.droppableProps} ref={provided.innerRef}>
                {this.state.ingIds.map((id, index) =>
                  <Draggable key={id} draggableId={id.toString()} index={index}>
                    {(provided) => (
                      <div className="item-container" ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
                        <li className="list-group-item">
                          {<EditableIngredient objId={id} position={index+1}/>}
                        </li>
                      </div>
                    )}
                  </Draggable>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Toggleable style={{float: "left"}}>
          <li key={99999} className="list-group-item" style={{height: "37.2px"}}>
            <NewIngInputField/>
          </li>
          <img src="/icons/plus-circle.svg" style={{width: "2.5rem", padding: "0.5rem"}}/>
          <img src="/icons/minus-circle.svg" style={{width: "2.5rem", padding: "0.5rem"}}/>
        </Toggleable>
      </ul>

    const NoteList = this.state.noteIds.map(id => {
      const note = gon.recipe.notes[id]

      const removeNote = (evt) => {
        Rails.ajax({url: note.url, type: 'DELETE', success: (raw) => {
          let ids = this.state.noteIds.filter(item => item != note.id)
          this.setState({noteIds: ids})
          delete gon.recipe.notes[note.id]
        }})
      }

      return (
        <Row key={id} gap="5px" marginBottom="5px">
          [{note.item_nb}]
          <Block flexGrow="1">
            <BubbleTiptap content={note.content} model="recipe_note" field="content" url={note.url}/>
          </Block>
          <DeleteConfirmButton id={`note-${note.id}`} onDeleteConfirm={removeNote} message="Je veux enlever cette note?" />
        </Row>
      )
    })

    const Tools = this.state.toolIds.map(id => (
      <li key={id}>
        {gon.recipe.tools[id].name}
      </li>
    ))

    const model = new Model("recipe", gon.recipe)
    console.log(model)
    
    return (<>
      <div className="recipe-body">

        <div className="bg-fill" style={{width: "100%", height: "0.5rem"}}></div>
        <div className="d-flex bg-fill ps-3 w-100" style={{fontSize: "1.2rem", alignItems: "center", flexWrap: "wrap", fontWeight: "bold"}}>
          <input className="bg-fill plain-input" type="text" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} onBlur={this.updateName} />
        </div>
        <div className="bg-fill" style={{width: "100%", height: "0.5rem"}}></div>

        <h2>Ingrédients</h2>
        {IngredientList}
      
        <h2>Instructions</h2>
        <Tiptap model="recipe" field="text" url={gon.recipe.url}/>
        <InstructionsShortcuts/>
        
        <h3>Notes</h3>
        {NoteList}
        <button type="button" className="plain-btn" onClick={() => this.appendNote()}>
          <img src="/icons/plus-circle.svg" style={{width: "2.5rem", padding: "0.5rem"}}/>
        </button>
        
        <h2>Outils</h2>
        <ul style={{fontSize: "1.1rem"}}>
          {Tools}
        </ul>
        
        <h2>Informations</h2>
        <table className="table table-light">
          <tbody>
            <tr>
              <th>Sorte de recette</th>
              <td><CollectionSelect2 model={model} field="recipe_kind_id" options={gon.recipe_kinds.map(k => k.id)} showOption={(id) => gon.recipe_kinds.find(k => k.id == id).name} includeBlank="true"></CollectionSelect2></td>
            </tr>
            <tr>
              <th>Temps de préparation</th>
              <td><TextInputField2 model={model} field="preparation_time"></TextInputField2></td>
            </tr>
            <tr>
              <th>Temps de cuisson</th>
              <td><TextInputField2 model={model} field="cooking_time"></TextInputField2></td>
            </tr>
            <tr>
              <th>Temps total</th>
              <td><TextInputField2 model={model} field="total_time"></TextInputField2></td>
            </tr>
            <tr>
              <th>Portions</th>
              <td><TextInputField2 model={model} field="raw_servings"></TextInputField2></td>
            </tr>
            <tr>
              <th>Ingrédient principal</th>
              <td><CollectionSelect2 model={model} field="main_ingredient_id" options={this.state.ingIds} showOption={(ingId) => gon.recipe.ingredients[ingId].food.name} includeBlank="true"></CollectionSelect2></td>
            </tr>
          </tbody>
        </table>

        <h2>Références</h2>

      </div>
    </>)
  }
}

// https://reactjs.org/docs/integrating-with-other-libraries.html
class Partial extends React.Component {

  constructor(props){
    super(props);
    this.partialId = props.partialId
  }

  componentDidMount() {
    let el = document.getElementById(this.partialId)
    el.style.display = "block"
    this.ref.appendChild(el)
  }

  render() {
    return <div ref={el => this.ref = el} />;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.recipe_editor = React.createRef()
  const root = document.getElementById('root')

  const modHandler = new ModificationsHandler()
  window.registerEditor = (editor, model, field, url) => {
    modHandler.registerEditor(editor, model, field, url)
  }

  if (root) {ReactDOM.render(<RecipeEditor ref={window.recipe_editor}/>, root)}
})


//// TODO: Rename if this works with tokens too
//function findMatchingChar(str, start, ch, notCh) {
//  let depth = 0
//  for (let i = start; i < str.length; i++) {
//    if (str[i] == notCh) {
//      depth += 1
//    } else if (str[i] == ch) {
//      if (depth <= 0) {return i}
//      depth -= 1
//    }
//  }
//  console.log("Unable to find matching char "+ch)
//  console.log("Depth", depth)
//  throw 'Missing matching char!';
//}
//
//const TokenType = {
//  LINK: 1,
//}
//
//class Token {
//  constructor({value, type}) {
//    this.value = value
//    this.type = type
//  }
//}
//
//function tokenizeLine(line) {
//  let tokens = []
//  let str = ""
//  for (let i = 0; i < line.length; i++) {
//    // TODO: Clean this. Remove duplication...
//    if (line.charAt(i) == "[") {
//      if (str != '') {tokens.push(str); str = ''}
//      let endIndex = findMatchingChar(line, i+1, "]", "[")
//      tokens.push(line.slice(i,endIndex+1))
//      i = endIndex
//    } else if (line.charAt(i) == "<") {
//      if (str != '') {tokens.push(str); str = ''}
//        let endIndex = findMatchingChar(line, i+1, ">", "<")
//      tokens.push(line.slice(i,endIndex+1))
//      i = endIndex
//    } else if (line.charAt(i) == "{") {
//      if (str != '') {tokens.push(str); str = ''}
//        let endIndex = findMatchingChar(line, i+1, "}", "{")
//      tokens.push(line.slice(i,endIndex+1))
//      i = endIndex
//    } else {
//      str += line.charAt(i)
//    }
//  }
//  if (str != '') {tokens.push(str); str = ''}
//  return tokens
//}
//
//// link syntaxes:
//// [note: 1]
//// [link_note: 1]
//// [recipe: 100]
//// [food: 100]
//// [url: "http://www.hedacuisine.com/"]
//// [label: "home", url: "http://www.hedacuisine.com/"]
//function replaceLink(token) {
//
//  let args = {}
//  // FIXME: Don't split in semicolon inside a string
//  token.slice(1, -1).split(";").forEach(a => {
//    let s = a.split(":", 2)
//    if (s[1]) {args[s[0].trim()] = s[1].trim()}
//  })
//  if (args.note) {
//    //return `<span id="note-${args.note}">[{args.note}]</span>`
//    return <span id={"note-"+args.note}>[{args.note}]</span>
//  } else if (args.link_note) {
//    return <a href={"#note-"+args.link_note}>{args.label || "["+args.link_note+"]"}</a>
//  }
//  console.log("Oups, this kind of link is not yet supported!", args)
//  return token
//}
//
//function replaceIngredients(token) {
//
//  // FFFFFFFFUUUUUUUUUUUUUUUUUUCCCCCCCCCCCCCCCKKKKKKKKKKKKKKKKKKKKKKKKKKKKK Les ingrédients doivent être une liste... pas un hash map... parce que l'ordre des ingrédients est important...
//  //let q = token.slice(1, -1)
//  //if (parseInt(q) == q) {
//  //  let ing = gon.recipe.ingredients[parseInt(q)]
//  //  return <a href={ing.id}>{ing.food.name}</a>
//  //} else {
//    return token
//  //}
//}
//
//function processTokens(tokens) {
//  let processed = []
//  for (let i = 0; i < tokens.length; i++) {
//    let token = tokens[i]
//    if (token.startsWith("[")) {
//      processed.push(replaceLink(token))
//    } else if (token.startsWith("{")) {
//      processed.push(replaceIngredients(token))
//    } else if (token.startsWith("<")) {
//      let tag = token.slice(1,-1)
//      let endIndex = findMatchingChar(tokens, i+1, `</${tag}>`, `<${tag}>`)
//      processed.push(<sup>{processTokens(tokens.slice(i+1,endIndex))}</sup>)
//      i = endIndex
//    } else {
//      processed.push(token)
//    }
//  }
//
//  return processed
//}
//
//function processInstructionText(text) {
//  let tokens = tokenizeLine(text)
//  return processTokens(tokens)
//}
//
//const RecipePreview = ({instructions}) => {
//
//  if (!instructions) {return null}
//
//  let stepNb = 1
//  let ings = []
//  let lines = null
//  try {
//
//    lines = instructions.split('\n').map((raw, i) => {
//      let line = raw.trim()
//      if (line.startsWith("/")) {
//        return <p key={i}><i>{processInstructionText(line.slice(1).trim())}</i></p>
//      } else if (line.startsWith("$$$")) {
//        return <h5>{line.slice(1).trim()}</h5>
//      } else if (line.startsWith("$$")) {
//        return <h4>{line.slice(1).trim()}</h4>
//      } else if (line.startsWith("$")) {
//        return <h3>{line.slice(1).trim()}</h3>
//      } else if (line.startsWith("-")) {
//        ings.push(new Ingredient({raw: line.slice(1).trim()}))
//      } else if (line.startsWith("#")) {
//        return <div key={i}><span className="step-number">{stepNb}</span>{' '}{processInstructionText(line.slice(1).trim())}</div>
//        stepNb += 1
//      } else {
//        return <p key={i}>{processInstructionText(line)}</p>
//      }
//    })
//    for(var i = 0;i < lines.length;i++){
//        //code here using lines[i] which will give you each line
//    }
//  } catch (e) {
//    console.error(e);
//    return <Block color="red">Syntax error</Block>
//  }
//
//  return (<>
//    <h2>Ingrédients</h2>
//      <ul className="list-group" style={{maxWidth: "800px"}}>
//        {ings.map(ing => (
//          <li className="list-group-item" >
//            {ing.detailed()}
//          </li>
//        ))}
//      </ul>
//    <h2>Instructions</h2>
//    <div>
//      {lines}
//    </div>
//    <h2>Outils</h2>
//    <h2>Informations</h2>
//    <h2>Références</h2>
//  </>)
//}
//
//const InstructionsPreview = ({instructions}) => {
//
//  if (!instructions) {return null}
//
//  let stepNb = 1
//
//  let lines = instructions.split('\n').map((raw, i) => {
//    let line = raw.trim()
//    if (line.startsWith("/")) {
//      return <p key={i}><i>{processInstructionText(line.slice(1).trim())}</i></p>
//    } else if (line.startsWith("$$$")) {
//      return <h5>{line.slice(1).trim()}</h5>
//    } else if (line.startsWith("$$")) {
//      return <h4>{line.slice(1).trim()}</h4>
//    } else if (line.startsWith("$")) {
//      return <h3>{line.slice(1).trim()}</h3>
//    } else if (line.startsWith("#")) {
//      return <div key={i}><span className="step-number">{stepNb}</span>{' '}{processInstructionText(line.slice(1).trim())}</div>
//      stepNb += 1
//    } else {
//      return <p key={i}>{processInstructionText(line)}</p>
//    }
//  })
//  for(var i = 0;i < lines.length;i++){
//      //code here using lines[i] which will give you each line
//  }
//
//  return (<>
//    <div>
//      {lines}
//    </div>
//  </>)
//}
