import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import {themeCssClass, Theme} from '../models/theme'

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

import {Model, TextFieldTag, HiddenFieldTag, SubmitTag, TextInputField, TextAreaField, CollectionSelect, MODEL_BOOK_RECIPE} from '../form'

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
    this.newBookRecipeRecipeIdRef = React.createRef();
    this.state = {
      book: gon.book,
      recipes: gon.recipes,
    };
    this.theme = gon.theme
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

    const book = this.state.book
    const new_book_recipe = {class_name: "book_recipe"}
    
    //<TextFieldTag field="book_recipe[recipe_id}"/>
    //<HiddenFieldTag field="book_id" value={gon.book.id}/>
    //<SubmitTag value="Ajouter"/>
    const addBookRecipe = () => {
      const recipeId = this.newBookRecipeRecipeIdRef.current.value
      let data = new FormData()
      data.append("book_recipe[recipe_id]", recipeId)
      Rails.ajax({url: gon.book_book_recipes_path, type: 'POST', data: data, success: (raw) => {
        const response = JSON.parse(raw)
        const book_recipe = response.book_recipe
        console.log(response)
        const recipes = [...this.state.recipes, book_recipe.recipe]
        this.setState({recipes})
      }, error: (errors) => {
        console.error(errors)
        //toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
      }})
    }
    return (<>
      <Theme theme={this.theme}/>
      <div>
        <b>Rechercher: </b>
        <RecipeKindFinder onRecipeKindFound={onRecipeKindFound}/>
        <button>Rechercher</button>
      </div>
      <div ref={this.recipeFindRef} />
      <div className={`book ${themeCssClass(this.theme)}`}>
        <div className="page title-page">
          <h1>{book.name}</h1>
          <div className="author">de {book.author}</div>
        </div>
        <div className="page index-page">
          <h2>Liste des recettes</h2>
          <ul>
            {this.state.recipes.map((recipe) => (
              <li key={recipe.id}><a href={`#recipe-body-${recipe.id}`}>{recipe.name}</a></li>
            ))}
            <li key="0">
              <input type="text" id="new-book-recipe-recipe-id" placeholder="Numéro de recette..." ref={this.newBookRecipeRecipeIdRef}/>
              <button type="button" onClick={addBookRecipe} >Ajouter</button>
            </li>
          </ul>
        </div>
        {this.state.recipes.map((recipe) => (
          <div className="page" key={`page-recipe-${recipe.id}`} dangerouslySetInnerHTML={{__html: recipe.html}}/>
        ))}
      </div>
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
