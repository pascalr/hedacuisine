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
      gon.recipe.ingredients.push(response)
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

  const ing = gon.recipe.ingredients.find(el => (el.id == props.objId))
  if (ing == null) {return null;}

  const removeIngredient = (evt) => {
    Rails.ajax({url: ing.url, type: 'DELETE', success: (raw) => {
      window.recipe_editor.current.removeIng(ing.id)
      gon.recipe.ingredients = gon.recipe.ingredients.filter(item => item.id != ing.id);
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

const TextInputField = ({model, field, initial}) => {
  const [value, setValue] = useState(initial)

  const name = model+"["+field+"]"

  const updateField = () => {
    if (value != initial) {
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
      <b><label htmlFor={field}>{field}</label></b>{': '}
      <input type="text" value={value||''} name={name} id={field} onChange={(e) => setValue(e.target.value)} onBlur={updateField} />
    </div>
  )
}

//<img src="/icons/plus-circle.svg" style={{width: "2.5rem", padding: "0.5rem"}} />
      
class RecipeEditor extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      name: gon.recipe.name,
      ingIds: gon.recipe.ingredients.map(obj => obj.id),
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
        <TextInputField model="recipe" initial={gon.recipe.base_recipe_id} field="base_recipe_id"></TextInputField>
        <TextInputField model="recipe" initial={gon.recipe.preparation_time} field="preparation_time"></TextInputField>
        <TextInputField model="recipe" initial={gon.recipe.cooking_time} field="cooking_time"></TextInputField>
        <TextInputField model="recipe" initial={gon.recipe.total_time} field="total_time"></TextInputField>
        <TextInputField model="recipe" initial={gon.recipe.raw_servings} field="raw_servings"></TextInputField>
        <div>main_ingredient_id</div>
        
        <h2>Instructions</h2>
        
        <h2>Références</h2>

      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.recipe_editor = React.createRef()
  ReactDOM.render(<RecipeEditor ref={window.recipe_editor}/>, document.getElementById('root'))
})
