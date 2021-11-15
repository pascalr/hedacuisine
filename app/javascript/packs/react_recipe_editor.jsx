import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Autosuggest from 'react-autosuggest'

import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'

import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import Quantity from 'models/quantity'
import Utils from "recipe_utils"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'


//import './style.css' // import style.css stylesheet
//
import '../styles/prose_mirror.scss'

const Toolbar = ({ editor }) => {

  const width = 24
  const height = 24

  //onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
  //      className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
  //    >

  if (!editor) {return null}
  return (
    <div className="toolbar">
      <Inline padding="0 1em">
        <select class="ql-header">
          <option value="3">Titre 1</option>
          <option value="4">Titre 2</option>
          <option value="5">Titre 3</option>
          <option selected>Normal</option>
        </select>
      </Inline>
      <Inline padding="0 1em">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-type-bold" viewBox="0 0 16 16">
            <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
          </svg>
        </button> 
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-type-italic" viewBox="0 0 16 16">
            <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
          </svg>
        </button> 
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-type-strikethrough" viewBox="0 0 16 16">
            <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967z"/>
          </svg>
        </button> 
      </Inline>
      <Inline padding="0 1em">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-list-ol" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
            <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"/>
          </svg>
        </button> 
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-list-check" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0zm0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0zm0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button> 
        <span className="dropdown">
          <button type="button" className="dropdown-toggle" id="ingDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-egg-fried" viewBox="0 0 16 16">
              <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              <path d="M13.997 5.17a5 5 0 0 0-8.101-4.09A5 5 0 0 0 1.28 9.342a5 5 0 0 0 8.336 5.109 3.5 3.5 0 0 0 5.201-4.065 3.001 3.001 0 0 0-.822-5.216zm-1-.034a1 1 0 0 0 .668.977 2.001 2.001 0 0 1 .547 3.478 1 1 0 0 0-.341 1.113 2.5 2.5 0 0 1-3.715 2.905 1 1 0 0 0-1.262.152 4 4 0 0 1-6.67-4.087 1 1 0 0 0-.2-1 4 4 0 0 1 3.693-6.61 1 1 0 0 0 .8-.2 4 4 0 0 1 6.48 3.273z"/>
            </svg>
          </button>
          <ul class="dropdown-menu" aria-labelledby="ingDropdown">
            <li><a class="dropdown-item" href="#">TODO</a></li>
          </ul>
        </span>
      </Inline>
    </div>
  )
  //<button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'is-active' : ''}>
  //  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-type-underline" viewBox="0 0 16 16">
  //    <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z"/>
  //  </svg>
  //</button> 
}

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: gon.recipe.text,
  })

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default Tiptap

class Ingredient {
  constructor(args = {}) {
    if (args.raw) {
      [this.qty, this.foodName] = Ingredient.parseRaw(args.raw)
    }
    if (args.qty) {this.qty = args.qty}
    if (args.foodName) {this.qty = args.foodName}
  }
  simple() {
    if (!this.qty) {return ''}
    if (!this.qty.unit) {return `${this.qty.pretty()} ${this.foodName}`}
    return `${this.qty.pretty()} ${Utils.prettyPreposition(this.foodName)}${this.foodName}`
  }
  detailed() {
    return this.simple()
  }
  static parseRaw(raw) {
    const separators = ["de", "d'"]
    for (let i = 0; i < separators.length; i++) {
      if (raw.includes(separators[i])) {
        const s = raw.split(separators[i])
        let rawQty = s[0].trim()
        let foodName = s[1].trim()
        let qty = new Quantity({raw: rawQty})
        return [qty, foodName]
      }
    }
    let qty = new Quantity({raw: raw})
    let food = qty.label
    qty.label = null
    return [qty, food]
  }
}

function prettyIngredient(ing) {

  var linkSingular = "<a href='/foods/"+ing.dataset.foodId+"'>"+ing.dataset.foodNameSingular+"</a> "

  if (ing.dataset.raw == null || ing.dataset.raw == "") {return linkSingular}

  var quantity = new Quantity({raw: ing.dataset.raw})
  var unit = quantity.unit
  var qty = quantity.nb * window.scale
  if (unit) {qty *= unit.value}

  if (unit && unit.is_weight) {
    var r = Utils.prettyWeight(qty) + " "
  } else if (unit && unit.is_volume) {
    var r = Utils.prettyVolume(qty) + " "
  } else {
    var r = Utils.prettyFraction(qty) + " "
    if (unit) {r += unit.name + " "}
  }
  if (unit && ing.dataset.preposition) {r += ing.dataset.preposition }
  if ((!unit || (!unit.is_volume && !unit.is_weight)) && qty > 1) {
    r += "<a href='/foods/"+ing.dataset.foodId+"'>"+ing.dataset.foodNamePlural+"</a> "
  } else {
    r += linkSingular 
  }
  if (ing.dataset.comment) {
    r += " " + ing.dataset.comment + " "
  }
  return r
}

// TODO: Rename if this works with tokens too
function findMatchingChar(str, start, ch, notCh) {
  let depth = 0
  for (let i = start; i < str.length; i++) {
    if (str[i] == notCh) {
      depth += 1
    } else if (str[i] == ch) {
      if (depth <= 0) {return i}
      depth -= 1
    }
  }
  console.log("Unable to find matching char "+ch)
  console.log("Depth", depth)
  throw 'Missing matching char!';
}

const TokenType = {
  LINK: 1,
}

class Token {
  constructor({value, type}) {
    this.value = value
    this.type = type
  }
}

function tokenizeLine(line) {
  let tokens = []
  let str = ""
  for (let i = 0; i < line.length; i++) {
    // TODO: Clean this. Remove duplication...
    if (line.charAt(i) == "[") {
      if (str != '') {tokens.push(str); str = ''}
      let endIndex = findMatchingChar(line, i+1, "]", "[")
      tokens.push(line.slice(i,endIndex+1))
      i = endIndex
    } else if (line.charAt(i) == "<") {
      if (str != '') {tokens.push(str); str = ''}
        let endIndex = findMatchingChar(line, i+1, ">", "<")
      tokens.push(line.slice(i,endIndex+1))
      i = endIndex
    } else if (line.charAt(i) == "{") {
      if (str != '') {tokens.push(str); str = ''}
        let endIndex = findMatchingChar(line, i+1, "}", "{")
      tokens.push(line.slice(i,endIndex+1))
      i = endIndex
    } else {
      str += line.charAt(i)
    }
  }
  if (str != '') {tokens.push(str); str = ''}
  return tokens
}

// link syntaxes:
// [note: 1]
// [link_note: 1]
// [recipe: 100]
// [food: 100]
// [url: "http://www.hedacuisine.com/"]
// [label: "home", url: "http://www.hedacuisine.com/"]
function replaceLink(token) {

  let args = {}
  // FIXME: Don't split in semicolon inside a string
  token.slice(1, -1).split(";").forEach(a => {
    let s = a.split(":", 2)
    if (s[1]) {args[s[0].trim()] = s[1].trim()}
  })
  if (args.note) {
    //return `<span id="note-${args.note}">[{args.note}]</span>`
    return <span id={"note-"+args.note}>[{args.note}]</span>
  } else if (args.link_note) {
    return <a href={"#note-"+args.link_note}>{args.label || "["+args.link_note+"]"}</a>
  }
  console.log("Oups, this kind of link is not yet supported!", args)
  return token
}

function replaceIngredients(token) {

  // FFFFFFFFUUUUUUUUUUUUUUUUUUCCCCCCCCCCCCCCCKKKKKKKKKKKKKKKKKKKKKKKKKKKKK Les ingrédients doivent être une liste... pas un hash map... parce que l'ordre des ingrédients est important...
  //let q = token.slice(1, -1)
  //if (parseInt(q) == q) {
  //  let ing = gon.recipe.ingredients[parseInt(q)]
  //  return <a href={ing.id}>{ing.food.name}</a>
  //} else {
    return token
  //}
}

function processTokens(tokens) {
  let processed = []
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i]
    if (token.startsWith("[")) {
      processed.push(replaceLink(token))
    } else if (token.startsWith("{")) {
      processed.push(replaceIngredients(token))
    } else if (token.startsWith("<")) {
      let tag = token.slice(1,-1)
      let endIndex = findMatchingChar(tokens, i+1, `</${tag}>`, `<${tag}>`)
      processed.push(<sup>{processTokens(tokens.slice(i+1,endIndex))}</sup>)
      i = endIndex
    } else {
      processed.push(token)
    }
  }

  return processed
}

function processInstructionText(text) {
  let tokens = tokenizeLine(text)
  return processTokens(tokens)
}

const RecipePreview = ({instructions}) => {

  if (!instructions) {return null}

  let stepNb = 1
  let ings = []
  let lines = null
  try {

    lines = instructions.split('\n').map((raw, i) => {
      let line = raw.trim()
      if (line.startsWith("/")) {
        return <p key={i}><i>{processInstructionText(line.slice(1).trim())}</i></p>
      } else if (line.startsWith("$$$")) {
        return <h5>{line.slice(1).trim()}</h5>
      } else if (line.startsWith("$$")) {
        return <h4>{line.slice(1).trim()}</h4>
      } else if (line.startsWith("$")) {
        return <h3>{line.slice(1).trim()}</h3>
      } else if (line.startsWith("-")) {
        ings.push(new Ingredient({raw: line.slice(1).trim()}))
      } else if (line.startsWith("#")) {
        return <div key={i}><span className="step-number">{stepNb}</span>{' '}{processInstructionText(line.slice(1).trim())}</div>
        stepNb += 1
      } else {
        return <p key={i}>{processInstructionText(line)}</p>
      }
    })
    for(var i = 0;i < lines.length;i++){
        //code here using lines[i] which will give you each line
    }
  } catch (e) {
    console.error(e);
    return <Block color="red">Syntax error</Block>
  }

  return (<>
    <h2>Ingrédients</h2>
      <ul className="list-group" style={{maxWidth: "800px"}}>
        {ings.map(ing => (
          <li className="list-group-item" >
            {ing.detailed()}
          </li>
        ))}
      </ul>
    <h2>Instructions</h2>
    <div>
      {lines}
    </div>
    <h2>Outils</h2>
    <h2>Informations</h2>
    <h2>Références</h2>
  </>)
}

const InstructionsPreview = ({instructions}) => {

  if (!instructions) {return null}

  let stepNb = 1

  let lines = instructions.split('\n').map((raw, i) => {
    let line = raw.trim()
    if (line.startsWith("/")) {
      return <p key={i}><i>{processInstructionText(line.slice(1).trim())}</i></p>
    } else if (line.startsWith("$$$")) {
      return <h5>{line.slice(1).trim()}</h5>
    } else if (line.startsWith("$$")) {
      return <h4>{line.slice(1).trim()}</h4>
    } else if (line.startsWith("$")) {
      return <h3>{line.slice(1).trim()}</h3>
    } else if (line.startsWith("#")) {
      return <div key={i}><span className="step-number">{stepNb}</span>{' '}{processInstructionText(line.slice(1).trim())}</div>
      stepNb += 1
    } else {
      return <p key={i}>{processInstructionText(line)}</p>
    }
  })
  for(var i = 0;i < lines.length;i++){
      //code here using lines[i] which will give you each line
  }

  return (<>
    <div>
      {lines}
    </div>
  </>)
}

function updateIngQuantityCallback() {
}

function updateListOrder() {
}

const InstructionsHelp = props => (
  <>
    <button type="button" className="btn-image">
      <img src="/icons/question-circle-blue.svg" data-bs-toggle="collapse" data-bs-target="#show-help" style={{width: "2em"}}></img>
    </button>
    <div className="collapse" id="show-help">
      <h2>Aide</h2>
      <h3>Instructions</h3>
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

  const [comment, setComment] = useState(props.comment);
  const [visual, setVisual] = useState(comment && comment != '' ? VisualState.EXPANDED : VisualState.CLOSED);

  const commentInput = useRef(null);

  useEffect(() => {
    if (visual == VisualState.EXPANDING) {
      setVisual(VisualState.EXPANDED)
      commentInput.current.focus()
    }
  }, [visual]);

  const updateComment = () => {
    if (comment != props.comment) {
      let data = new FormData()
      data.append('recipe_ingredient[comment]', comment)
      Rails.ajax({url: props.ingUrl, type: 'PATCH', data: data})
    }
    if (!comment || comment == '') {
      setVisual(VisualState.CLOSED)
    }
  }

  if (visual == VisualState.CLOSED) {
    return (
      <button type="button" className="btn-image" onClick={() => setVisual(VisualState.EXPANDING)}>
        <img src="/icons/chat-left.svg" style={{marginLeft: "10px"}}/>
      </button>
    )
  } else {
    const style = {border: "none", borderBottom: "1px dashed gray", transition: "width 0.4s ease-in-out"}
    style.width = visual == VisualState.EXPANDED ? "200px" : "0px"
    return (
      <div style={{display: "inline-block", marginLeft: "10px"}}>
        (<input type="text" value={comment || ''} style={style} ref={commentInput} onChange={(e) => setComment(e.target.value)} onBlur={updateComment} />)
      </div>
    )
  }
}

const EditableIngredient = (props) => {

  // For popover. See https://mui.com/components/popover/
  const [anchorEl, setAnchorEl] = React.useState(null);

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
      <button type="button" aria-describedby={'delete-popover'} className="btn-image" onClick={(evt) => setAnchorEl(evt.currentTarget)}>
        <img src="/icons/x-lg.svg"/>
      </button>
      <Popover
        id='delete-popover'
        open={anchorEl != null}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        transformOrigin={{vertical: 'bottom', horizontal: 'right'}}
      >
        <Typography sx={{ p: 2 }}>
          Je veux enlever cet ingrédient?
          <button type="button" className="btn btn-primary" style={{marginLeft: "10px"}} onClick={removeIngredient}>Oui</button>
        </Typography>
      </Popover>
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

class RecipeEditor extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      name: gon.recipe.name,
      ingIds: Object.keys(gon.recipe.ingredients),
      toolIds: Object.keys(gon.recipe.tools),
      instructionsSlave: gon.recipe.complete_instructions,
      showAddNewIng: false,
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

    const Ingredients = this.state.ingIds.map((id, index) =>
      <Draggable key={id} draggableId={id.toString()} index={index}>
        {(provided) => (
          <div className="item-container" ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
            <li className="list-group-item">
              {<EditableIngredient objId={id} position={index+1}/>}
            </li>
          </div>
        )}
      </Draggable>
    )

    const NewIng = !this.state.showAddNewIng ? null : (
      <li key={99999} className="list-group-item" style={{height: "37.2px"}}>
        <NewIngInputField/>
      </li>
    )

    const IngredientList = 
      <ul className="list-group" style={{maxWidth: "800px"}}>
        <DragDropContext onDragEnd={this.handleDropIng}>
          <Droppable droppableId="list-container">
            {(provided) => (
              <div className="list-container" {...provided.droppableProps} ref={provided.innerRef}>
                {Ingredients}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {NewIng}
      </ul>

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
        <img src={this.state.showAddNewIng ? "/icons/minus-circle.svg" : "/icons/plus-circle.svg"} style={{width: "2.5rem", padding: "0.5rem"}}
             onClick={() => this.setState({showAddNewIng: !this.state.showAddNewIng})} />
      
        <h2>Instructions</h2>
        <Tiptap/>
      </div>
        
      <div className="recipe-body">
        
        <h2>Outils</h2>
        <ul style={{fontSize: "1.1rem"}}>
          {Tools}
        </ul>
        
        <h2>Informations</h2>
        <TextInputField model={model} field="base_recipe_id"></TextInputField>
        <TextInputField model={model} field="preparation_time"></TextInputField>
        <TextInputField model={model} field="cooking_time"></TextInputField>
        <TextInputField model={model} field="total_time"></TextInputField>
        <TextInputField model={model} field="raw_servings"></TextInputField>
        <CollectionSelect model={model} field="main_ingredient_id" options={this.state.ingIds} showOption={(ingId) => gon.recipe.ingredients[ingId].food.name} includeBlank="true"></CollectionSelect>

        <h2>Références</h2>

      </div>
    </>)
  }
}

class RecipeTextEditor extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      name: gon.recipe.name,
      contentSlave: gon.recipe.content,
    };
    this.updateName = this.updateName.bind(this);
  }

  updateName() {
    if (this.name == gon.recipe.name) {return;}
    let data = new FormData()
    data.append('recipe[name]', this.state.name)
    Rails.ajax({url: gon.recipe.url, type: 'PATCH', data: data})
  }

  render() {

    const model = new Model("recipe", gon.recipe)
    console.log(model)

    return (<>
      <Row gap="10px">
        <div>
          <h3>Format Heda</h3>
          <InstructionsHelp/>
          <TextAreaField model={model} field="content" cols={80} rows={30} changeCallback={modified => this.setState({contentSlave: modified})}></TextAreaField>
        </div>
        <div>
          <h3>Live preview</h3>
          <div className="recipe-body">
            <div className="bg-fill" style={{width: "100%", height: "0.5rem"}}></div>
            <div className="d-flex bg-fill ps-3 w-100" style={{fontSize: "1.2rem", alignItems: "center", flexWrap: "wrap", fontWeight: "bold"}}>
              <input className="bg-fill plain-input" type="text" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} onBlur={this.updateName} />
            </div>
            <div className="bg-fill" style={{width: "100%", height: "0.5rem"}}></div>
            <RecipePreview instructions={this.state.contentSlave} />
          </div>
        </div>
      </Row>
    </>)
  }
}

// Why this is not a method of Trix.Editor is beyond me...
function toggleTrixAttribute(getTrixEditor, attr) {
  const editor = getTrixEditor()
  if (editor.attributeIsActive(attr)) {
    editor.deactivateAttribute(attr)
  } else {
    editor.activateAttribute(attr)
  }
}

const TrixToolbar = ({getTrixEditor}) => {
  return (
    <Row>
      <button type="button" className="btn-image" onClick={() => toggleTrixAttribute(getTrixEditor, "bold")}>
        <img src="/icons/type-bold.svg" style={{width: "2em"}}></img>
      </button>
      <button type="button" className="btn-image" onClick={() => toggleTrixAttribute(getTrixEditor, "heading")}>
        <img src="/icons/type-h1.svg" style={{width: "2em"}}></img>
      </button>
      <button type="button" className="btn-image" onClick={() => toggleTrixAttribute(getTrixEditor, "subHeading")}>
        <img src="/icons/type-h2.svg" style={{width: "2em"}}></img>
      </button>
      <button type="button" className="btn-image" onClick={() => toggleTrixAttribute(getTrixEditor, "bold")}>
        <img src="/icons/type-h3.svg" style={{width: "2em"}}></img>
      </button>
    </Row>
  )
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

const RichTextEditor = (props) => {
  
  const editorRef = useRef(null);
  const getTrixEditor = () => editorRef.current.editor

  return (<>
    <TrixToolbar getTrixEditor={getTrixEditor}/>
    <trix-editor class="trix-content" ref={editorRef} dangerouslySetInnerHTML={{__html: "<p>Your html code here.<p>"}}></trix-editor>
  </>)
    //<trix-editor id="recipe_text_2"
    //  class="trix-content"
    //  data-direct-upload-url="http://localhost:3000/rails/active_storage/direct_uploads?locale=fr-CA"
    //  data-blob-url-template="http://localhost:3000/rails/active_storage/blobs/redirect/:signed_id/:filename?locale=fr-CA"
    //</trix-editor>
  //
}

//<button type="button" class="trix-button trix-button--icon trix-button--icon-code" data-trix-attribute="code" title="Code" tabindex="-1" disabled="">Code</button>
const CustomToolbar = () => (<>
  <span class="trix-button-group trix-button-group--text-tools" data-trix-button-group="text-tools">
    <button type="button" class="trix-button trix-button--icon trix-button--icon-bold" data-trix-attribute="bold" data-trix-key="b" title="Bold" tabindex="-1">Bold</button>
    <button type="button" class="trix-button trix-button--icon trix-button--icon-italic" data-trix-attribute="italic" data-trix-key="i" title="Italic" tabindex="-1">Italic</button>
    <button type="button" class="trix-button trix-button--icon trix-button--icon-strike" data-trix-attribute="strike" title="Strikethrough" tabindex="-1">Strikethrough</button>
    <button type="button" class="trix-button trix-button--icon trix-button--icon-link" data-trix-attribute="href" data-trix-action="link" data-trix-key="k" title="Link" tabindex="-1">Link</button>
  </span>

  <span class="trix-button-group trix-button-group--block-tools" data-trix-button-group="block-tools">
    <button type="button" class="trix-button trix-button--icon trix-button--icon-heading-1 trix-active" data-trix-attribute="heading1" title="Heading" tabindex="-1" data-trix-active="">Heading</button>
    <button type="button" class="trix-button trix-button--icon trix-button--icon-quote" data-trix-attribute="quote" title="Quote" tabindex="-1" disabled="">Quote</button>
    <button type="button" class="trix-button trix-button--icon trix-button--icon-bullet-list" data-trix-attribute="bullet" title="Bullets" tabindex="-1" disabled="">Bullets</button>
    <button type="button" class="trix-button trix-button--icon trix-button--icon-number-list" data-trix-attribute="number" title="Numbers" tabindex="-1" disabled="">Numbers</button>
    <button type="button" class="trix-button trix-button--icon trix-button--icon-decrease-nesting-level" data-trix-action="decreaseNestingLevel" title="Decrease Level" tabindex="-1" disabled="">Decrease Level</button>
    <button type="button" class="trix-button trix-button--icon trix-button--icon-increase-nesting-level" data-trix-action="increaseNestingLevel" title="Increase Level" tabindex="-1" disabled="">Increase Level</button>
  </span>

  <span class="trix-button-group trix-button-group--file-tools" data-trix-button-group="file-tools">
    <button type="button" class="trix-button trix-button--icon trix-button--icon-attach" data-trix-action="attachFiles" title="Attach Files" tabindex="-1">Attach Files</button>
  </span>

  <span class="trix-button-group-spacer"></span>

  <span class="trix-button-group trix-button-group--history-tools" data-trix-button-group="history-tools">
    <button type="button" class="trix-button trix-button--icon trix-button--icon-undo" data-trix-action="undo" data-trix-key="z" title="Undo" tabindex="-1" disabled="">Undo</button>
    <button type="button" class="trix-button trix-button--icon trix-button--icon-redo" data-trix-action="redo" data-trix-key="shift+z" title="Redo" tabindex="-1" disabled="">Redo</button>
  </span>
</>)

document.addEventListener('DOMContentLoaded', () => {
  window.recipe_editor = React.createRef()
  const root = document.getElementById('root')
  const rootText = document.getElementById('root-text')
  if (root) {ReactDOM.render(<RecipeEditor ref={window.recipe_editor}/>, root)}
  if (rootText) {ReactDOM.render(<RecipeTextEditor ref={window.recipe_editor}/>, rootText)}
})

//const ModelFields = (props) => {
//  let elements = React.Children.toArray(props.children).map(child => {
//    return React.cloneElement(child, { modelName: props.name, initial: gon[props.name][child.props.field] })
//  })
//  return <>{elements}</>
//}
//
//
//  <%= form_with(model: @recipe, local: true) do |form| %>
//  
//    <h2 class="h2">Instructions V2</h2>
//  
//    <div id="trix-toolbar"></div>
//    <%= form.rich_text_area :text %>
//  
//    <div class="actions">
//      <%= form.submit %>
//    </div>
//  <% end %>
//
//

  //<button id="quill-save-button" type="button">Enregistrer</button>
  //const saveButton = document.getElementById('quill-save-button')
  //if (saveButton) {
  //  saveButton.addEventListener("click", function(evt) {
  //  })
  //}


  //const trixToolbar = document.getElementById('trix-toolbar')
  //if (trixToolbar) {
  //  Trix.config.blockAttributes.heading = {
  //    tagName: "h3",
  //    terminal: true,
  //    breakOnReturn: true,
  //    group: false
  //  }
  //  Trix.config.blockAttributes.subHeading = {
  //    tagName: "h4",
  //    terminal: true,
  //    breakOnReturn: true,
  //    group: false
  //  }
  //  window.trixEditor
  //  var editor = document.querySelector("trix-editor").editor
  //  ReactDOM.render(<TrixToolbar editor={editor}/>, trixToolbar)

  //  const oldButtons = document.getElementsByClassName("trix-button-row")[0];
  //  const customButtons = document.getElementById("custom-trix-buttons")
  //  oldButtons.innerHTML = customButtons.innerHTML
  //  //oldButtons.appendChild(customButtons)
  //  //customButtons.style.display = "block"
  //  //ReactDOM.render(<CustomToolbar />, oldButtons)
  //}
