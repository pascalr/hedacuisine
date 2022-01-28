import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Autosuggest from 'react-autosuggest'

import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'

import Quantity from 'models/quantity'
import { Ingredient, Utils } from "recipe_utils"

import { DeleteConfirmButton } from 'components/delete_confirm_button'

import { Tiptap, BubbleTiptap, ModificationsHandler } from 'tiptap'
import '../styles/prose_mirror.scss'

import {TextField, CollectionSelect} from '../form'

import {EditRecipeImageModal} from '../modals'

export const RecipeImage = ({model, imageAttr, field, modal, ...props}) => {

  const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState(model[field])
  const handleOpen = () => {

    setShowModal(true)
    //let m = new bootstrap.Modal(document.querySelector(modal));
    //const form = document.querySelector(`${modal} form`);
    //form.addEventListener("ajax:success", (event) => {
    //  const [data, status, xhr] = event.detail;
    //  let image = JSON.parse(xhr.responseText)
    //  model[imageAttr] = image
    //  updateModelField(model, field, image.id)
    //});
    //m.show();
  }

  const removeImage = (evt) => {
    model[imageAttr] = null
    updateModelField(model, field, null)
    //Rails.ajax({url: ing.url, type: 'DELETE', success: (raw) => {
    //  window.recipe_editor.current.removeIng(ing.id)
    //  delete gon.recipe.ingredients[ing.id]
    //}})
  }


  return (<>
    <EditRecipeImageModal recipe={model} show={showModal} handleClose={() => setShowModal(false)} />
    <div style={{cursor: "pointer"}} onClick={handleOpen}>
      {props.children}
    </div>
  </>)
  //if (!model[field]) {
  //  return (<>
  //    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#edit-recipe-image-modal" onClick={handleOpen}>
  //      Ajouter une image
  //    </button>
  //  </>)
  //} else if (model[imageAttr]) {
  //  return (
  //    <span>
  //      {model[imageAttr].filename}
  //      <DeleteConfirmButton id={`del-im-${model[imageAttr].id}`} onDeleteConfirm={removeImage} message="Je veux enlever cette image?" />
  //    </span>
  //  )
  //}
  //throw "ImageField missing imageAttr"
}


function updateIngQuantityCallback() {
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
    id: 'newRecipeIngredientRawFood',
    onChange: (e, {newValue}) => setValue(newValue),
    //ref: foodInputField,
  };

  const postNewIngredient = (data) => {
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

  const addIngredient = (event, {suggestion, suggestionValue, suggestionIndex, sectionIndex, method}) => {
    let data = new FormData()
    data.append('recipe_ingredient[raw]', qty)
    data.append('recipe_ingredient[food_id]', suggestion.id)
    postNewIngredient(data)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let rawFood = e.currentTarget.elements.newRecipeIngredientRawFood.value
    let data = new FormData()
    data.append('recipe_ingredient[raw]', qty)
    data.append('recipe_ingredient[raw_food]', rawFood)
    postNewIngredient(data)
  }

  return (
    <Row gap="7px" align-items="flex-start">
      <form onSubmit={handleSubmit}>
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
        <input type="submit" value="Ajouter" />
      </form>
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
  const [visual, setVisual] = useState(props.commentJson && props.commentJson != '' ? VisualState.EXPANDED : VisualState.CLOSED);

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
        <BubbleTiptap content={JSON.parse(props.commentJson)} model="recipe_ingredient" json_field="comment_json" html_field="comment_html" url={props.ingUrl}/>
      </Row>
    )
    //(<input type="text" value={comment || ''} style={style} ref={commentInput} onChange={(e) => setComment(e.target.value)} onBlur={updateComment} />)
  }
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
      {ing.food ? <a href={ing.food.url}>{ing.food.name}</a> : <div>{ing.name}</div>}
      <EditableIngredientComment ingUrl={ing.url} commentJson={ing.comment_json} />
      <Block flexGrow="1" />
      <DeleteConfirmButton id={`ing-${ing.id}`} onDeleteConfirm={removeIngredient} message="Je veux enlever cet ingrédient?" />
    </Row>
  )
  //<a href={ing.url} data-confirm="Are you sure?" data-method="delete"><img src="/icons/x-lg.svg" style={{float: "right"}}/></a>
}

//const RECIPE_MODEL = new Model("recipe")

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
      recipe: gon.recipe,
      name: gon.recipe.name,
      ingIds: ingIds,
      noteIds: noteIds,
      toolIds: Object.keys(gon.recipe.tools),
      instructionsSlave: gon.recipe.complete_instructions,
    };
    this.state.recipe.onUpdate = (recipe) => {this.setState({recipe})}
    this.handleDropIng = this.handleDropIng.bind(this);
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

  appendNote() {
    let data = new FormData()
    //data.append('recipe_note[content]', '')
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
            <BubbleTiptap content={JSON.parse(note.json)} model="recipe_note" json_field="json" html_field="html" url={note.url}/>
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

    const recipe = this.state.recipe
    const recipe_kind = gon.recipe_kinds.find(k => k.id == recipe.recipe_kind_id)
    const image_path = gon.recipe.image_path || "/default_recipe_01.png"
    //console.log(model)
    
    return (<>
      <div className="responsive-sm-above">
        <div>
          <div className="over-container">
            <RecipeImage model={recipe} field='image_id' imageAttr='image' modal='#edit-recipe-image-modal'>
              <img className="recipe-show-image" src={image_path} width="452" height="304"/>
              {gon.recipe.image_path ?
                <div className="bottom-right" style={{color: 'white', fontSize: '2em'}}>
                  <img src="/icons/pencil-circle.svg" style={{width: "5rem", padding: "0.5rem"}}/>
                </div>
                :
                <div className="centered" style={{fontSize: '2em', width: '100%'}}>Ajouter une image<br/>ou<br/>Sélectionner une catégorie</div>
              }
            </RecipeImage>
          </div> 
        </div>
        <div style={{width: '100%'}}>
          <h1>
            <span className="recipe-title">
              <TextField model={recipe} field="name" className="plain-input" />
            </span>
          </h1>
          <div>
            <b>Préparation (minutes): </b>
            <span style={{color: 'gray'}}>
              <TextField model={recipe} field="preparation_time" className="editable-input" />
            </span>
          </div>
          <div>
            <b>Cuisson (minutes): </b>
            <span style={{color: 'gray'}}>
              <TextField model={recipe} field="cooking_time" className="editable-input" />
            </span>
          </div>
          <div>
            <b>Total (minutes): </b>
            <span style={{color: 'gray'}}>
              <TextField model={recipe} field="total_time" className="editable-input" />
            </span>
          </div>
          <div>
            <b>Portions: </b>
            <span style={{color: 'gray'}}>
              <TextField model={recipe} field="raw_servings" className="editable-input" />
            </span>
          </div>
        </div>
      </div>
      <div className="recipe-body">

        <h2>Ingrédients</h2>
        {IngredientList}
      
        <h2>Instructions</h2>
        <Tiptap model="recipe" json_field="json" html_field="html" url={gon.recipe.url} content={JSON.parse(gon.recipe.json)} />
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
              <td><CollectionSelect model={recipe} field="recipe_kind_id" options={gon.recipe_kinds.map(k => k.id)} showOption={(id) => gon.recipe_kinds.find(k => k.id == id).name} includeBlank="true"></CollectionSelect></td>
            </tr>
            <tr>
              <th>Ingrédient principal</th>
              <td><CollectionSelect model={recipe} field="main_ingredient_id" options={this.state.ingIds} showOption={(ingId) => gon.recipe.ingredients[ingId].name} includeBlank="true"></CollectionSelect></td>
            </tr>
          </tbody>
        </table>

        <h2>Références</h2>

      </div>
    </>)
  }
}
//            <p><i><%= my_sanitize(recipe_kind.description_html) %></i></p>
//            <% nb = recipe_kind.recipes.all_public.count %>
//            <% nb += 1 unless recipe.is_public %>
//            <% if nb <= 1 %>
//              <p style="font-size: 0.9em;">Il n'y a pas encore de recette similaire disponible dans cette catégorie.</p>
//              <%= link_to "Voir la catégorie", recipe_kind, class: "btn btn-outline-primary" %>
//            <% else %>
//              <p style="font-size: 0.9em;">Sur ce site, il y a <%= nb %> recettes disponibles dans cette catégorie.</p>
//              <%= link_to "Voir les recettes similaires", recipe_kind, class: "btn btn-outline-primary" %>
//            <% end %>

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
  window.registerEditor = (editor, model, json_field, html_field, url) => {
    modHandler.registerEditor(editor, model, json_field, html_field, url)
  }

  if (root) {ReactDOM.render(<RecipeEditor ref={window.recipe_editor}/>, root)}
})


//            <tr>
//              <th>Temps de préparation</th>
//              <td><TextField model={recipe} field="preparation_time"></TextField></td>
//            </tr>
//            <tr>
//              <th>Temps de cuisson</th>
//              <td><TextField model={recipe} field="cooking_time"></TextField></td>
//            </tr>
//            <tr>
//              <th>Temps total</th>
//              <td><TextField model={recipe} field="total_time"></TextField></td>
//            </tr>
//            <tr>
//              <th>Portions</th>
//              <td><TextField model={recipe} field="raw_servings"></TextField></td>
//            </tr>
