import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function updateIngQuantityCallback() {
}

function updateListOrder() {
}

// FIXME: I think I should use onChange instead of onBlur
// And I think I should use value instead of defaultValue
  
//var elem = e("input", {type: "text", size: "20"})
//new autocomplete({
//  selector: elem,
//  minChars: 1,
//  source: function(term, suggest){
//    term = term.toLowerCase();
//    const choices = gon.foodList
//    const matches = [];
//    for (let i = 0; i < choices.length; i++)
//        if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
//    suggest(matches);
//  }
//})
//return elem

const NewIngInputField = props => (
  <input type="text" size="20"/>
)

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
      ingIds: gon.recipe.ingredients.map(obj => obj.id),
      newIngs: [],
    };

    this.addEmptyIng = this.addEmptyIng.bind(this);
    this.handleDropIng = this.handleDropIng.bind(this);
  }

  //swapIng(dragIndex, dropIndex) {
  //  let swappedIngs = swapArrayPositions(this.state.ings, dragIndex, dropIndex);
  //  this.setState({ings: swappedIngs})
  //}
  
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
    //data.append('recipe_ingredient[raw]', this.value)
    data.append('ing_id', droppedItem.draggableId)
    data.append('position', droppedItem.destination.index+1)
    // TODO: error: () => {}
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

    const NewIngs = this.state.newIngs.map(ing =>
      <li className="list-group-item">
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
      <div id="recipe-editor-v2">
        <h2>Ingrédients</h2>
        {IngredientList}
        <img src="/icons/plus-circle.svg" style={{width: "2.5rem", padding: "0.5rem"}} onClick={this.addEmptyIng} />
      </div>
    )
  }
}

//const Hello = props => (
//  <div>Hello {props.name}!</div>
//)
//
//Hello.defaultProps = {
//  name: 'David'
//}
//
//Hello.propTypes = {
//  name: PropTypes.string
//}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<RecipeEditor />, document.getElementById('root'))
})
