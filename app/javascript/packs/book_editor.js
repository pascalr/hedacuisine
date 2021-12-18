import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import {themeCssClass, Theme} from '../models/theme'

import { DeleteConfirmButton } from 'components/delete_confirm_button'

//import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Autosuggest from 'react-autosuggest'
//
//import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'
//
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
    this.newBookSectionNameRef = React.createRef();
    this.state = {
      book: gon.book,
      bookRecipes: gon.book_recipes,
      bookSections: gon.book_sections,
    };
    this.theme = gon.theme
    this.addRecipe = this.addRecipe.bind(this)
    this.addSection = this.addSection.bind(this)
    this.removeRecipe = this.removeRecipe.bind(this)
    this.removeSection = this.removeSection.bind(this)
  }
    
  addSection() {
    const sectionName = this.newBookSectionNameRef.current.value
    let data = new FormData()
    data.append("book_section[name]", sectionName)
    Rails.ajax({url: gon.book_book_sections_path, type: 'POST', data: data, success: (raw) => {
      const response = JSON.parse(raw)
      const book_section = response.book_section
      console.log(response)
      const bookSections = [...this.state.bookSections, book_section]
      this.setState({bookSections})
    }, error: (errors) => {
      console.error(errors)
      //toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
    }})
  }
    
  addRecipe() {
    const recipeId = this.newBookRecipeRecipeIdRef.current.value
    let data = new FormData()
    data.append("book_recipe[recipe_id]", recipeId)
    Rails.ajax({url: gon.book_book_recipes_path, type: 'POST', data: data, success: (raw) => {
      const response = JSON.parse(raw)
      const book_recipe = response.book_recipe
      console.log(response)
      const bookRecipes = [...this.state.bookRecipes, book_recipe]
      this.setState({bookRecipes})
    }, error: (errors) => {
      console.error(errors)
      //toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
    }})
  }

  removeSection(bookSection) {
    Rails.ajax({url: bookSection.url, type: 'DELETE', success: (raw) => {
      const bookSections = [...this.state.bookSections].filter(r => r.id != bookSection.id)
      this.setState({bookSections})
    }})
  }

  removeRecipe(bookRecipe) {
    Rails.ajax({url: bookRecipe.url, type: 'DELETE', success: (raw) => {
      const bookRecipes = [...this.state.bookRecipes].filter(r => r.id != bookRecipe.id)
      this.setState({bookRecipes})
    }})
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
            {this.state.bookSections.map((bookSection) => (
              <li className="section" key={'section-'+bookSection.id}>
                <a href={`#section-${bookSection.id}`}>{bookSection.name}</a>
                <DeleteConfirmButton id={`remove-book-section-${bookSection.id}`} onDeleteConfirm={() => this.removeSection(bookSection)} message="Je veux enlever cette section?" />
              </li>
            ))}
            {this.state.bookRecipes.map((bookRecipe) => (
              <li key={'recipe-'+bookRecipe.id}>
                <a href={`#recipe-body-${bookRecipe.recipe.id}`}>{bookRecipe.recipe.name}</a>
                <DeleteConfirmButton id={`remove-book-recipe-${bookRecipe.id}`} onDeleteConfirm={() => this.removeRecipe(bookRecipe)} message="Je veux enlever cette recette?" />
              </li>
            ))}
            <li key="0">
              <input type="text" id="new-book-recipe-recipe-id" placeholder="Numéro de recette..." ref={this.newBookRecipeRecipeIdRef}/>
              <button type="button" onClick={this.addRecipe} >Ajouter recette</button>
            </li>
            <li key="-1">
              <input type="text" id="new-book-section-name" placeholder="Nouvelle section..." ref={this.newBookSectionNameRef }/>
              <button type="button" onClick={this.addSection} >Ajouter section</button>
            </li>
          </ul>
        </div>
        {this.state.bookRecipes.map((bookRecipe) => (
          <div className="page" key={`page-recipe-${bookRecipe.id}`} dangerouslySetInnerHTML={{__html: bookRecipe.recipe.html}}/>
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
