import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Autosuggest from 'react-autosuggest'

import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'

import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

//import './style.css' // import style.css stylesheet

function updateIngQuantityCallback() {
}

function updateListOrder() {
}

const InstructionsHelp = props => (
  <>
    <button className="btn-image" onClick={() => setVisual(VisualState.EXPANDING)}>
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
      <button className="btn-image" onClick={() => setVisual(VisualState.EXPANDING)}>
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
      <button aria-describedby={'delete-popover'} className="btn-image" onClick={(evt) => setAnchorEl(evt.currentTarget)}>
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
          <button className="btn btn-primary" style={{marginLeft: "10px"}} onClick={removeIngredient}>Oui</button>
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

const TextAreaField = ({model, field, cols, rows}) => {
  const [value, setValue] = useState(model.currentValue(field))

  const name = model.name+"["+field+"]"

  const updateField = () => {
    if (value != model.currentValue(field)) {
      let data = new FormData()
      data.append(name, value)
      // FIXME: URL
      Rails.ajax({url: gon.recipe.url+".js", type: 'PATCH', data: data, error: (errors) => {
        toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
      }})
    }
  }

  return (
    <div className="field">
      <textarea value={value||''} name={name} id={field} cols={cols} rows={rows} onChange={(e) => setValue(e.target.value)} onBlur={updateField} />
    </div>
  )
}

const CollectionSelect = ({model, field, options, showOption, includeBlank}) => {
  const [value, setValue] = useState(model.currentValue(field))

  const name = model.name+"["+field+"]"
          
  const updateField = (e) => {
    let val = e.target.value
    if (val != model.currentValue(field)) {
      let data = new FormData()
      data.append(name, val)
      // FIXME: URL
      Rails.ajax({url: gon.recipe.url+".js", type: 'PATCH', data: data, 
        success: () => {setValue(val)},
        error: (errors) => {
          toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
      }})
    }
  }

  return (
    <div className="field">
      <b><label htmlFor={field}>{field}</label></b>{': '}
      <select name={name} id={field} value={value||''} onChange={updateField}>
        {includeBlank ? <option value="" key="1" label=" "></option> : null}
        {options.map((opt, i) => {
          return <option value={opt} key={i+2}>{showOption(opt)}</option>
        })}
      </select>
    </div>
  )
  //<select name="recipe[main_ingredient_id]" id="recipe_main_ingredient_id"><option value="" label=" "></option>
  //  <option value="229">sucre</option>
  //  <option value="230">huile</option>
  //  <option value="512">eau tiède</option>
  //  <option value="644">sel</option>
  //  <option value="227">levure sèche active</option>
  //  <option selected="selected" value="228">farine</option>
  //</select>
}

//<img src="/icons/plus-circle.svg" style={{width: "2.5rem", padding: "0.5rem"}} />
      
class RecipeEditor extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      name: gon.recipe.name,
      ingIds: Object.keys(gon.recipe.ingredients),
      toolIds: Object.keys(gon.recipe.tools),
      showAddNewIng: false
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
    
    return (
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
        
        <h2>Instructions</h2>
        <InstructionsHelp/>
        <TextAreaField model={model} field="complete_instructions" cols="100" rows="10"></TextAreaField>
        
        <h2>Références</h2>

      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.recipe_editor = React.createRef()
  ReactDOM.render(<RecipeEditor ref={window.recipe_editor}/>, document.getElementById('root'))
})

//const ModelFields = (props) => {
//  let elements = React.Children.toArray(props.children).map(child => {
//    return React.cloneElement(child, { modelName: props.name, initial: gon[props.name][child.props.field] })
//  })
//  return <>{elements}</>
//}
