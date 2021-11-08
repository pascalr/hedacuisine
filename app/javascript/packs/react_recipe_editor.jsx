import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import Sortable from "sortablejs"

function updateIngQuantityCallback() {
}

function addEmptyIng() {
}

function updateListOrder() {
}

// FIXME: I think I should use onChange instead of onBlur
// And I think I should use value instead of defaultValue

const RecipeEditor = props => {

  const Ingredients = gon.recipe.ingredients.map(ing =>
    <li className="list-group-item" key={ing.id}>
      <span style={{padding: "0 10px 0 0"}} className="handle">
        <b>{ing.item_nb}.</b>
      </span>
      <input onBlur={updateIngQuantityCallback} type="text" size="8" defaultValue={ing.raw} style={{border: "none", borderBottom: "1px solid gray"}} />
      <span> de </span>{/*" de " ou bien " - " si la quantité n'a pas d'unité => _1_____ - oeuf*/}
      <a href={ing.food.url}>{ing.food.name}</a>
      <span style={{marginLeft: "10px"}}>
        (
          <input type="text" size="20" defaultValue={ing.comment} style={{border: "none", borderBottom: "1px solid gray"}} />
        )
      </span>
      <a href={ing.url} data-confirm="Are you sure?" data-method="delete"><img src="/icons/x-lg.svg" style={{float: "right"}}/></a>
    </li>
  )

  const IngredientList = 
    <ul className="list-group" style={{maxWidth: "800px"}}>
      {Ingredients}
    </ul>
  
  //Sortable.create(ReactDOM.findDOMNode(IngredientList), {
  //  handle: ".handle",
  //  onEnd: updateListOrder
  //})
//      ), ...(gon.recipe.new_ingredients || []).map(ing =>
//        e("li", {className: "list-group-item"}, IngFoodInputField())
//      )

  return (
    <div id="recipe-editor-v2">
      <h2>Ingredients</h2>
      {IngredientList}
      <img src="/icons/plus-circle.svg" style={{width: "2.5rem", padding: "0.5rem"}} onClick={addEmptyIng} />
    </div>
  )
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
  ReactDOM.render(
    <RecipeEditor />,
    document.getElementById('root'),
  )
})
