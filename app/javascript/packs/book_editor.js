import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

//import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Autosuggest from 'react-autosuggest'
//
//import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'
//
//import Popover from '@mui/material/Popover';
//import Typography from '@mui/material/Typography';
//import Button from '@mui/material/Button';
//
//import Quantity from 'models/quantity'
//import { Ingredient, Utils } from "recipe_utils"

import {Model, TextInputField, TextAreaField, CollectionSelect, MODEL_BOOK_RECIPE} from '../form'

const RecipeKindFinder = ({onRecipeKindFound}) => {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const inputFieldProps = {
    placeholder: "Trouver une sorte de recette",
    value,
    onChange: (e, {newValue}) => setValue(newValue),
    //ref: foodInputField,
  };

  const setModel = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    console.log("Setting model!")
    onRecipeKindFound(suggestion.id)
    //updateAttributes({modelId: suggestion.id, linkName: suggestionValue})
  }
  
  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={({value}) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
       
        const matched = inputLength === 0 ? [] : gon.recipe_kinds.filter(model =>
          model.name.includes(inputValue)
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
      onSuggestionSelected={setModel}
      inputProps={inputFieldProps}
    />
  )
}

class BookEditor extends React.Component {
  
  constructor(props) {
    super(props);
    this.recipeFindRef = React.createRef();
    //this.state = {
    //  name: gon.recipe.name,
    //};
    //this.handleDropIng = this.handleDropIng.bind(this);
  }

  render() {

    const onRecipeKindFound = (recipeKindId) => {
      console.log('RecipeKindFound', recipeKindId)
      $.get(`/recipe_kinds/${recipeKindId}/search_recipe`, (raw) => {
        const node = this.recipeFindRef.current;
        node.innerHTML = raw
      })
    }
    
    return (<>
      <h2>Ajouter une recette</h2>
      <div>
        <b>Numéro:</b>
        <TextInputField model={MODEL_BOOK_RECIPE} field="recipe_id"></TextInputField>
        <button>Ajouter</button>
      </div>
      <div>
        <b>Rechercher: </b>
        <RecipeKindFinder onRecipeKindFound={onRecipeKindFound}/>
        <button>Rechercher</button>
      </div>
      <div ref={this.recipeFindRef} />
    </>)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  //const modHandler = new ModificationsHandler()
  //window.registerEditor = (editor, model, field, url) => {
  //  modHandler.registerEditor(editor, model, field, url)
  //}

  const root = document.getElementById('root')
  if (root) {ReactDOM.render(<BookEditor/>, root)}
})
