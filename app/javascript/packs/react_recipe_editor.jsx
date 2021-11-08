import React from 'react'
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

const EditableIngredient = (ing) => {

  const renderComment = (ing) => {

    const addComment = (evt) => {
      //this.setState()
    }

    if (ing.comment == null) {
      return (
        <button className="btn-image" onClick={addComment}>
          <img src="/icons/chat-left.svg" style={{marginLeft: "10px"}}/>
        </button>
      )
    } else {
      return (
        <span style={{marginLeft: "10px"}}>
          (<input type="text" size="20" defaultValue={ing.comment} style={{border: "none", borderBottom: "1px solid gray"}} />)
        </span>
      )
    }
  }

  return (<>
    <span style={{padding: "0 10px 0 0"}}><b>{ing.item_nb}.</b></span>
    <input onBlur={updateIngQuantityCallback} type="text" size="8" defaultValue={ing.raw} style={{border: "none", borderBottom: "1px solid gray"}} />
    <span> de </span>{/*" de " ou bien " - " si la quantité n'a pas d'unité => _1_____ - oeuf*/}
    <a href={ing.food.url}>{ing.food.name}</a>
    {renderComment(ing)}
    <a href={ing.url} data-confirm="Are you sure?" data-method="delete"><img src="/icons/x-lg.svg" style={{float: "right"}}/></a>
  </>)
}

class RecipeEditor extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      ings: gon.recipe.ingredients,
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
    var updatedList = [...this.state.ings];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    this.setState({ings: updatedList})
  }
  
  addEmptyIng() {
    this.setState(prevState => {
      return {newIngs: [...prevState.newIngs, {}]}
    })
  }

  render() {

    const Ingredients = this.state.ings.map((ing, index) =>
      <Draggable key={ing.id} draggableId={'ing-'+ing.id} index={index}>
        {(provided) => (
          <div className="item-container" ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
            <li className="list-group-item">
              {<EditableIngredient {...ing}/>}
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
        <h2>Ingredients</h2>
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
