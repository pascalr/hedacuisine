import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import {themeCssClass, Theme} from '../models/theme'

import { DeleteConfirmButton } from 'components/delete_confirm_button'

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Autosuggest from 'react-autosuggest'
//
import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'
//
//
//import Quantity from 'models/quantity'
//import { Ingredient, Utils } from "recipe_utils"

import {EditableField, TextField, ToggleField, CollectionSelect} from '../form'

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
      indexItems: [...gon.book_recipes, ...gon.book_sections].sort((a, b) => (a.position-b.position)),
    };
    this.state.book.onUpdate = (book) => this.setState({book})

    this.theme = gon.theme
    this.addRecipe = this.addRecipe.bind(this)
    this.addSection = this.addSection.bind(this)
    this.removeIndexItem = this.removeIndexItem.bind(this)
    this.handleIndexDrop = this.handleIndexDrop.bind(this)
  }
    
  addSection() {
    const sectionName = this.newBookSectionNameRef.current.value
    let data = new FormData()
    data.append("book_section[name]", sectionName)
    Rails.ajax({url: gon.book_book_sections_path, type: 'POST', data: data, success: (raw) => {
      const response = JSON.parse(raw)
      const book_section = response.book_section
      console.log(response)
      const indexItems = [...this.state.indexItems, book_section]
      this.setState({indexItems})
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
      const indexItems = [...this.state.indexItems, book_recipe]
      this.setState({indexItems})
    }, error: (errors) => {
      console.error(errors)
      //toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
    }})
  }

  removeIndexItem(item) {
    Rails.ajax({url: item.url, type: 'DELETE', success: (raw) => {
      const indexItems = [...this.state.indexItems].filter(r => r.id != item.id || r.class_name != item.class_name)
      this.setState({indexItems})
    }})
  }

  handleIndexDrop(droppedItem) {
    console.log('Handle index drop')
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    var updatedList = [...this.state.indexItems];
    //// Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    //// Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    this.setState({indexItems: updatedList})

    let data = new FormData()
    data.append('source_index', droppedItem.source.index)
    data.append('destination_index', droppedItem.destination.index)
    //data.append('draggable_id', droppedItem.draggableId)
    //data.append('draggable_type', droppedItem.draggableType)
    //data.append('position', droppedItem.destination.index+1)
    Rails.ajax({url: gon.on_index_change_book_path , type: 'PATCH', data: data})
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

    //  <div>
    //    <b>Rechercher: </b>
    //    <RecipeKindFinder onRecipeKindFound={onRecipeKindFound}/>
    //    <button>Rechercher</button>
    //  </div>
    
    return (<>
      <Row>
        <div>
          <Theme theme={this.theme}/>
          <div ref={this.recipeFindRef} />
          <div className={`book ${themeCssClass(this.theme)}`}>
            <div className="page title-page">
              <h1><EditableField model={book} field="name"/></h1>
              <div className="author">de {book.author}</div>
            </div>
            <div className="page index-page">
              <h2>Index</h2>
              <ul>
                <DragDropContext onDragEnd={this.handleIndexDrop}>
                  <Droppable droppableId="list-container">
                    {(provided) => (
                      <div className="list-container" {...provided.droppableProps} ref={provided.innerRef}>
                        {this.state.indexItems.map((item, index) => {
                          let is_section = item.class_name == "book_section"
                          let link = is_section ? `#section-${item.id}` : `#recipe-body-${item.recipe.id}`
                          let label = is_section ? item.name : item.recipe.name
                          let listItemClassName = is_section ? "section" : ''
                          return <Draggable key={link} draggableId={link.toString()} index={index}>
                            {(provided) => (
                              <div className="item-container" ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
                                <li className={listItemClassName}>
                                  <a href={link}>{label}</a>
                                  <DeleteConfirmButton id={link} onDeleteConfirm={() => this.removeIndexItem(item)} message="Je veux vraiment enlever?" />
                                </li>
                              </div>
                            )}
                          </Draggable>
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
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
            {this.state.indexItems.map((item) => {
              if (item.class_name == "book_section") {
                return <div id={`section-${item.id}`} className="page section-page" key={`page-section-${item.id}`}>
                    <h3>{item.name}</h3>
                  </div>
              } else {
                return <div className="page" key={`page-recipe-${item.id}`} dangerouslySetInnerHTML={{__html: item.recipe.html}}/>
              }
            })}
          </div>
        </div>
        <div>
          <h2>Paramètres</h2>

          <table className="table table-light">
            <tbody>
              <tr>
                <th><label htmlFor="book_is_public">Is public?</label></th>
                <td><ToggleField model={book} field="is_public"/></td>
              </tr>
              <tr>
                <th><label htmlFor="book_theme_id">Layout</label></th>
                <td><CollectionSelect model={book} field="theme_id" options={gon.themes.map(k => k.id)} showOption={(id) => gon.themes.find(k => k.id == id).name} /></td>
              </tr>
              <tr>
                <td colSpan="2"><a className="btn btn-outline-secondary" href={gon.theme.edit_url}>Edit layout</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Row>
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
