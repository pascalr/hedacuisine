import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { DeleteConfirmButton } from 'components/delete_confirm_button'

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Autosuggest from 'react-autosuggest'

import { ajax, sortBy } from "../utils"
import { combineOrderedListWithHeaders } from '../lib'

import { DescriptionTiptap, ModificationsHandler } from 'tiptap'

import {UploadableImage} from '../modals/uploadable_image'

//
import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'
//
//
//import Quantity from 'models/quantity'
//import { Ingredient, Utils } from "recipe_utils"

import {updateRecord, asyncUpdateModel, EditableField, TextField, ToggleField, CollectionSelect} from '../form'

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
      book_recipes: gon.book_recipes,
      book_sections: gon.book_sections,
    };
    this.state.book.image.onServerUpdate = (image) => {
      this.setState({book: updateRecord(this.state.book, {}, {image: image})})
    }
    this.state.book.onServerUpdate = (book) => {
      this.setState({book: updateRecord(this.state.book, book, {image: {}})})
    }
    //this.state.book.onUpdate = (book) => this.setState({book})

    this.addRecipe = this.addRecipe.bind(this)
    this.appendSection = this.appendSection.bind(this)
    this.removeBookRecipe = this.removeBookRecipe.bind(this)
    this.removeBookSection = this.removeBookSection.bind(this)
    this.handleIndexDrop = this.handleIndexDrop.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
  }

  appendSection() {
    ajax({url: gon.book.new_book_section_url, type: 'POST', data: {}, success: (section) => {
      this.setState({book_sections: [...this.state.book_sections, section]})
    }})
  }

  removeBookRecipe(book_recipe) {
    let recipes = this.state.book_recipes.filter(item => item.id != book_recipe.id)
    this.setState({book_recipes: recipes})
  }

  removeBookSection(section) {
    ajax({url: section.url, type: 'DELETE', success: () => {
      let sections = this.state.book_sections.filter(i => i.id != section.id)
      this.setState({book_sections: sections})
    }})
  }
    
  //addSection() {
  //  ajax({url: gon.recipe.new_ingredient_section_url, type: 'POST', data: {}, success: (section) => {
  //    this.setState({ingredient_sections: [...this.state.ingredient_sections, section]})
  //  }})
  //  const sectionName = this.newBookSectionNameRef.current.value
  //  let data = new FormData()
  //  data.append("book_section[name]", sectionName)
  //  ajax({url: gon.book_book_sections_path, type: 'POST', data: data, success: (raw) => {
  //    const response = JSON.parse(raw)
  //    const book_section = response.book_section
  //    console.log(response)
  //    const indexItems = [...this.state.indexItems, book_section]
  //    this.setState({indexItems})
  //  }, error: (errors) => {
  //    console.error(errors)
  //    //toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
  //  }})
  //}
    
  addRecipe() {
    const recipeId = this.newBookRecipeRecipeIdRef.current.value
    let data = new FormData()
    data.append("book_recipe[recipe_id]", recipeId)
    ajax({url: gon.book_book_recipes_path, type: 'POST', data: data, success: (book_recipe) => {
      this.setState({book_recipes: [...this.state.book_recipes, book_recipe]})
    }})
  }

  removeIndexItem(item) {
    ajax({url: item.url, type: 'DELETE', success: (raw) => {
      const indexItems = [...this.state.indexItems].filter(r => r.id != item.id || r.class_name != item.class_name)
      this.setState({indexItems})
    }})
  }

  handleDrop({source, destination, type, draggableId}) {
    if (!destination) return; // Ignore drop outside droppable container
    
    //console.log('drop', droppedItem)
    
    if (type == "RECIPE") {
      let recipe_id = draggableId.substr(12) // removes "drag-recipe-"
      let section_id = destination.droppableId == "recipes-container" ? null : destination.droppableId.substr(13) // removes "drop-section-"
    
      console.log('destination', destination)

      let book_recipes = [...this.state.book_recipes].map(recipe => {
        if (recipe.id == recipe_id) {
          recipe.book_section_id = section_id
          recipe.position = destination.index+1

          ////var updatedList = [...this.state.book_recipes.filter(r => r.book_section_id == section_id)];
          ////const [reorderedItem] = updatedList.splice(source.index, 1);
          ////updatedList.splice(destination.index, 0, reorderedItem);
          
          //let data = new FormData()
          //// TODO: Set position too...
          ////data.append('position', destination+1)
          //data.append('book_section_id', section_id)
          //ajax({url: recipe.url, type: 'PATCH', data: data})
        } else if (recipe.book_section_id == section_id) {
          recipe.position = recipe.position + (recipe.position <= destination.index ? 0 : 1)
        }
        return recipe
      })
      let data = new FormData()
      data.append('moved_id', recipe_id)
      data.append('section_id', section_id)
      data.append('position', destination.index+1)
      ajax({url: gon.move_book_recipe_url, type: 'PATCH', data: data})
      this.setState({book_recipes})
    } else {
      let section_id = draggableId.substr(13) // removes "drag-section-"

      console.log("source", source)
      console.log("destination", destination)

      //let source = getClosestItemNb(droppedItem.source.index)-1
      //let destination = getClosestItemNb(droppedItem.destination.index)-1
      //let droppedRecord = items[droppedItem.source.index]
      //if (droppedRecord.class_name == "book_recipe") {
      var updatedList = [...this.state.book_sections];
      const [reorderedItem] = updatedList.splice(source.index, 1);
      updatedList.splice(destination.index, 0, reorderedItem);

      //  let data = new FormData()
      //  data.append('moved_id', droppedRecord.id)
      //  data.append('position', destination+1)
      //  ajax({url: gon.book.move_book_recipe_url, type: 'PATCH', data: data})
      //  for (let i = 0; i < updatedList.length; i++) {
      //    updatedList[i].position = i+1
      //  }
      let data = new FormData()
      data.append('moved_id', section_id)
      data.append('position', destination.index+1)
      ajax({url: gon.move_book_section_url, type: 'PATCH', data: data})
      this.setState({book_sections: updatedList})

      //let book_sections = [...this.state.book_sections].map(section => {
      //  if (section.id == section_id) {
      //    section.position = section_id
      //    //let data = new FormData()
      //    //// TODO: Set position too...
      //    ////data.append('position', destination+1)
      //    //data.append('book_section_id', section_id)
      //    //ajax({url: recipe.url, type: 'PATCH', data: data})
      //  }
      //  return recipe
      //})
      //this.setState({book_recipes})
    }
  }

  handleIndexDrop(items, droppedItem) {

    const getClosestItemNb = (index) => {
      for (let i = index; i < items.length; i++) {
        if (items[i].class_name == "book_recipe") {
          return items[i].position
        }
      }
      return this.state.book_recipes.length
    }

    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    let source = getClosestItemNb(droppedItem.source.index)-1
    let destination = getClosestItemNb(droppedItem.destination.index)-1
    let droppedRecord = items[droppedItem.source.index]
    if (droppedRecord.class_name == "book_recipe") {
      var updatedList = [...this.state.book_recipes];
      const [reorderedItem] = updatedList.splice(source, 1);
      updatedList.splice(destination, 0, reorderedItem);

      let data = new FormData()
      data.append('moved_id', droppedRecord.id)
      data.append('position', destination+1)
      ajax({url: gon.book.move_book_recipe_url, type: 'PATCH', data: data})
      for (let i = 0; i < updatedList.length; i++) {
        updatedList[i].position = i+1
      }
      this.setState({book_recipes: updatedList})
    } else {
      var others = [...this.state.book_sections].filter(i => i.id != droppedRecord.id);
      droppedRecord.before_recipe_at = droppedItem.source.index < droppedItem.destination.index ? destination+2 : destination+1
      let data = new FormData()
      data.append('book_section[before_recipe_at]', droppedRecord.before_recipe_at)
      ajax({url: droppedRecord.url, type: 'PATCH', data: data})
      this.setState({book_sections: [...others, droppedRecord]})
    }
  }
  //handleIndexDrop(droppedItem) {
  //  console.log('Handle index drop')
  //  // Ignore drop outside droppable container
  //  if (!droppedItem.destination) return;
  //  var updatedList = [...this.state.indexItems];
  //  //// Remove dragged item
  //  const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
  //  //// Add dropped item
  //  updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
  //  this.setState({indexItems: updatedList})

  //  let data = new FormData()
  //  data.append('source_index', droppedItem.source.index)
  //  data.append('destination_index', droppedItem.destination.index)
  //  //data.append('draggable_id', droppedItem.draggableId)
  //  //data.append('draggable_type', droppedItem.draggableType)
  //  //data.append('position', droppedItem.destination.index+1)
  //  ajax({url: gon.on_index_change_book_path , type: 'PATCH', data: data})
  //}

  render() {

    const indexItems = combineOrderedListWithHeaders(this.state.book_recipes, this.state.book_sections, header => header.before_recipe_at)

    const onRecipeKindFound = (recipeKindId) => {
      console.log('RecipeKindFound', recipeKindId)
      $.get(`/recipe_kinds/${recipeKindId}/search_recipe`, (raw) => {
        const node = this.recipeFindRef.current;
        node.innerHTML = raw
      })
    }
      
    const book = this.state.book
    const new_book_recipe = {class_name: "book_recipe"};

    //  <div>
    //    <b>Rechercher: </b>
    //    <RecipeKindFinder onRecipeKindFound={onRecipeKindFound}/>
    //    <button>Rechercher</button>
    //  </div>
    
    const onImageDelete = () => {
      asyncUpdateModel(book, {front_page_image_id: null})
    }
    let sortedRecipes = sortBy(this.state.book_recipes, 'position')
    
    return (<>
      <div style={{maxWidth: "900px", margin: "auto"}}>
        <div style={{width: "fit-content", margin: "auto"}}>
          <div>
            <br/><br/>
            <div className="d-block d-sm-flex gap-20 text-center">
              <UploadableImage image={book.image} onDelete={onImageDelete} variant="small_book" width="235" />
              <div>
                <div className="d-flex">
                  <h2 className="text-black">
                    <EditableField model={book} field="name" className="plain-input"/>
                  </h2>
                </div>
                <div style={{maxWidth: "600px", width: "100%", height: "300px"}}>
                  <DescriptionTiptap content={JSON.parse(book.description_json)} model="book" json_field="description_json" html_field="description_html" url={book.url}/>
                </div>
              </div>
            </div>
            <br/><br/>
          </div>
        </div>
        <h1>Liste des recettes</h1>
        <hr/>
        <div ref={this.recipeFindRef} />
        <ul>
          <DragDropContext onDragEnd={(droppedItem) => this.handleDrop(droppedItem)}>
            <Droppable droppableId="sections-container" type="SECTION">
              {(provided) => (<>
                <div className="sections-container" {...provided.droppableProps} ref={provided.innerRef}>
                  {this.state.book_sections.map((section, index) => (
                    <Draggable key={`drag-section-${section.id}`} draggableId={`drag-section-${section.id.toString()}`} index={index}>
                      {(provided) => (<>
                        <div className="item-container" ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
                          <li className="section">
                            <h3 key={section.id} style={{margin: "0", padding: "0.5em 0 0.2em 0"}}>
                              <TextField model={section} field="name" className="plain-input" />
                              <span style={{margin: "0 0.2em"}}>
                                <DeleteConfirmButton id={`del-book-section-${section.id}`} onDeleteConfirm={() => this.removeBookSection(section)} message="Je veux enlever ce titre?" />
                              </span>
                            </h3>
                          </li>
                        </div>
                        <Droppable droppableId={`drop-section-${section.id}`} type="RECIPE">
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} style={{paddingBottom: "1.5em"}}>
                              {sortedRecipes.filter(r => r.book_section_id == section.id).map((book_recipe, index) => {
                                return <Draggable key={`drag-recipe-${book_recipe.id}`} draggableId={`drag-recipe-${book_recipe.id.toString()}`} index={index}>
                                  {(provided) => (<>
                                    <div className="item-container" ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
                                      <li>
                                        <span>{book_recipe.recipe.name}</span>
                                        <DeleteConfirmButton id={`del-book-section-${book_recipe.id}`} onDeleteConfirm={() => this.removeBookRecipe(book_recipe)} message="Je veux vraiment enlever?"/>
                                      </li>
                                    </div>
                                  </>)}
                                </Draggable>
                              })}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </>)}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </>)}
            </Droppable>
            <Droppable droppableId="recipes-container" type="RECIPE">
              {(provided) => (<>
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <h3 style={{margin: "0", padding: "0.5em 0 0.2em 0"}}>
                    Recettes non catégorisées
                  </h3>
                  {this.state.book_recipes.filter(r => !r.book_section_id).map((book_recipe, index) => {
                    return <Draggable key={`drag-recipe-${book_recipe.id}`} draggableId={`drag-recipe-${book_recipe.id.toString()}`} index={index}>
                      {(provided) => (<>
                        <div className="item-container" ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
                          <li>
                            <span>{book_recipe.recipe.name}</span>
                            <DeleteConfirmButton id={`del-book-section-${book_recipe.id}`} onDeleteConfirm={() => this.removeBookRecipe(book_recipe)} message="Je veux vraiment enlever?"/>
                          </li>
                        </div>
                      </>)}
                    </Draggable>
                  })}
                  {provided.placeholder}
                </div>
              </>)}
            </Droppable>
          </DragDropContext>
        </ul>
        <ul>
          <DragDropContext onDragEnd={(droppedItem) => this.handleIndexDrop(indexItems, droppedItem)}>
            <Droppable droppableId="list-container">
              {(provided) => (
                <div className="list-container" {...provided.droppableProps} ref={provided.innerRef}>
                  {indexItems.map((item, index) => {
                    let is_section = item.class_name == "book_section"
                    let key = is_section ? `section-${item.id}` : `book-recipe-${item.id}`
                    let listItemClassName = is_section ? "section" : ''
                    return <Draggable key={key} draggableId={key.toString()} index={index}>
                      {(provided) => (
                        <div className="item-container" ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
                          <li className={listItemClassName}>
                            {is_section
                              ?
                              <h3 style={{margin: "0", padding: "0.5em 0 0.2em 0"}}>
                                <TextField model={item} field="name" className="plain-input" />
                                <span style={{margin: "0 0.2em"}}>
                                  <DeleteConfirmButton id={`del-${key}`} onDeleteConfirm={() => this.removeBookSection(item)} message="Je veux enlever ce titre?" />
                                </span>
                              </h3>
                              :
                              <>
                                <span>{item.recipe.name}</span>
                                <DeleteConfirmButton id={`del-${key}`} onDeleteConfirm={() => this.removeBookRecipe(item)} message="Je veux vraiment enlever?"/>
                              </>
                            }
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
            <button type="button" onClick={this.appendSection} >Ajouter section</button>
          </li>
        </ul>
      </div>
    </>)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  //const modHandler = new ModificationsHandler()
  //window.registerEditor = (editor, model, field, url) => {
  //  modHandler.registerEditor(editor, model, field, url)
  //}
  
  const modHandler = new ModificationsHandler()
  window.registerEditor = (editor, model, json_field, html_field, url) => {
    modHandler.registerEditor(editor, model, json_field, html_field, url)
  }

  const root = document.getElementById('root')
  if (root) {ReactDOM.render(<BookEditor/>, root)}
})
