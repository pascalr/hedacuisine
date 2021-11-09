import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Autosuggest from 'react-autosuggest'

//import './style.css' // import style.css stylesheet

function updateIngQuantityCallback() {
}

function updateListOrder() {
}

const NewIngInputField = props => {

  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [newlyAdded, setNewlyAdded] = useState(true);

  const inputField = useRef(null);

  useEffect(() => {
    if (newlyAdded) {
      inputField.current.focus()
      setNewlyAdded(false)
    }
  }, [newlyAdded]);

  const inputFieldProps = {
    placeholder: 'Sélectionner un aliment',
    value,
    onChange: (e, {newValue}) => setValue(newValue),
    ref: inputField
  };

  const addIngredient = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    let data = new FormData()
    data.append('recipe_ingredient[food_id]', suggestion.id)
    Rails.ajax({url: gon.recipe.new_ingredient_url, type: 'POST', data: data, success: (raw) => {
      const response = JSON.parse(raw)
      //gon.recipe.ingredients.push({url: response.url, food: {name: response.food_name, url: response.food_url}})
      gon.recipe.ingredients.push(response)
      window.recipe_editor.current.addIng(response.id)
      setValue('')
    }})
  }

  return (
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
  )
}

const EditableIngredient = (props) => {

  const ing = gon.recipe.ingredients.find(el => (el.id == props.objId))

  const [comment, setComment] = useState(ing.comment == "" ? null : ing.comment);
  const [newlyAdded, setNewlyAdded] = useState(false);

  const commentInput = useRef(null);

  useEffect(() => {
    if (newlyAdded) {
      commentInput.current.focus()
      setNewlyAdded(false)
    }
  }, [newlyAdded]);
      
  const addComment = (evt) => {
    setComment("")
    setNewlyAdded(true)
  }

  return (<>
    <span style={{padding: "0 10px 0 0"}}><b>{props.position}.</b></span>
    <input onBlur={updateIngQuantityCallback} type="text" size="8" defaultValue={ing.raw} style={{border: "none", borderBottom: "1px solid gray"}} />
    <span> de </span>{/*" de " ou bien " - " si la quantité n'a pas d'unité => _1_____ - oeuf*/}
    <a href={ing.food.url}>{ing.food.name}</a>
    {(() => {
      if (comment == null) {
        return (
          <button className="btn-image" onClick={addComment}>
            <img src="/icons/chat-left.svg" style={{marginLeft: "10px"}}/>
          </button>
        )
      } else {
        const style = {border: "none", borderBottom: "1px solid gray", transition: "width 0.4s ease-in-out"}
        style.width = newlyAdded ? "0px" : "200px"
        return (
          <div style={{display: "inline-block", marginLeft: "10px"}}>
            (<input type="text" defaultValue={comment} style={style} ref={commentInput} />)
          </div>
        )
      }
    })()}
    <a href={ing.url} data-confirm="Are you sure?" data-method="delete"><img src="/icons/x-lg.svg" style={{float: "right"}}/></a>
  </>)
}

class RecipeEditor extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      name: gon.recipe.name,
      ingIds: gon.recipe.ingredients.map(obj => obj.id),
      newIngs: [],
    };
    this.addEmptyIng = this.addEmptyIng.bind(this);
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

  updateName() {
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
  
  addEmptyIng() {
    this.setState(prevState => {
      return {newIngs: [...prevState.newIngs, {}]}
    })
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

    const NewIngs = this.state.newIngs.map((ing, i) =>
      <li key={i} className="list-group-item">
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
        {NewIngs}
      </ul>
    
    return (
      <div className="recipe-body">

        <div className="bg-fill" style={{width: "100%", height: "0.5rem"}}></div>
        <div className="d-flex bg-fill ps-3 w-100" style={{fontSize: "1.2rem", alignItems: "center", flexWrap: "wrap", fontWeight: "bold"}}>
          <input className="bg-fill plain-input" type="text" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} onBlur={this.updateName} />
        </div>
        <div className="bg-fill" style={{width: "100%", height: "0.5rem"}}></div>

        <h2>Ingrédients</h2>
        {IngredientList}
        <img src="/icons/plus-circle.svg" style={{width: "2.5rem", padding: "0.5rem"}} onClick={this.addEmptyIng} />

        <h2>Outils</h2>
        <img src="/icons/plus-circle.svg" style={{width: "2.5rem", padding: "0.5rem"}} />
        
        <h2>Informations</h2>
        
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
