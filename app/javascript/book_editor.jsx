import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { DeleteConfirmButton } from './components/delete_confirm_button'

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Autosuggest from 'react-autosuggest'

import { ajax, sortBy, isBlank } from "./utils"
import { Show, combineOrderedListWithHeaders } from './lib'

import { DescriptionTiptap, ModificationsHandler } from './tiptap'

import {UploadableImage} from './modals/uploadable_image'
import {AddExistingRecipe} from './modals/add_existing_recipe'

import { book_recipes_book_path, create_new_recipe_book_path } from './routes'

import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'
//
//import Quantity from 'models/quantity'

import {updateRecord, asyncUpdateModel, EditableField, TextField, ToggleField, CollectionSelect} from './form'


const AddNewRecipe = ({show, addNewRecipe}) => {

  const inputRef = useRef(null)

  useEffect(() => {
    if (show) {inputRef.current.focus()}
  }, [show])

  handleKeyPressed = (e) => {
    if (e.key === "Enter") {
      addNewRecipe(inputRef.current.value)
      inputRef.current.value = ''
    }
  }

  return (
    <Show cond={show}>
      <div>
        <input type="text" ref={inputRef} onKeyPress={handleKeyPressed} />
        <button type="button" onClick={() => addNewRecipe(inputRef.current.value)} >Créer</button>
      </div>
    </Show>
  )
}

const PercentageCompleted = ({recipe}) => {

  let percent = 0
  if (!isBlank(recipe.ingredients)) {percent += 30}
  if (!isBlank(recipe.json)) {percent += 30}
  if (recipe.cooking_time || recipe.preparation_time || recipe.total_time) {percent += 15}
  if (recipe.raw_servings) {percent += 15}
  if (recipe.main_ingredient_id) {percent += 10}

  return (<>
    <span>{percent}%</span>
  </>)
}

class BookEditor extends React.Component {
  
  constructor(props) {
    super(props);
    this.recipeFindRef = React.createRef();
    this.newBookSectionNameRef = React.createRef();
    this.addExistingRecipeBtnRef = React.createRef();
    this.state = {
      book: gon.book,
      book_recipes: gon.book_recipes,
      book_sections: gon.book_sections,
      show_add_new_recipe: false,
    };
    this.state.book.image.onServerUpdate = (image) => {
      this.setState({book: updateRecord(this.state.book, {}, {image: image})})
    }
    this.state.book.onServerUpdate = (book) => {
      this.setState({book: updateRecord(this.state.book, book, {image: {}})})
    }
    //this.state.book.onUpdate = (book) => this.setState({book})

    //this.addRecipeWithId = this.addRecipeWithId.bind(this)
    this.addNewRecipe = this.addNewRecipe.bind(this)
    this.appendSection = this.appendSection.bind(this)
    this.removeBookRecipe = this.removeBookRecipe.bind(this)
    this.removeBookSection = this.removeBookSection.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.createBookRecipe = this.createBookRecipe.bind(this)
  }

  appendSection() {
    ajax({url: gon.book.new_book_section_url, type: 'POST', data: {}, success: (section) => {
      this.setState({book_sections: [...this.state.book_sections, section]})
      this.newBookSectionNameRef.current.focus()
    }})
  }

  removeBookRecipe(book_recipe) {
    ajax({url: book_recipe.url, type: 'DELETE', success: () => {
      let recipes = this.state.book_recipes.filter(item => item.id != book_recipe.id)
      this.setState({book_recipes: recipes})
    }})
  }

  removeBookSection(section) {
    ajax({url: section.url, type: 'DELETE', success: () => {
      let sections = this.state.book_sections.filter(i => i.id != section.id)
      this.setState({book_sections: sections})
    }})
  }
    
  //addRecipeWithId() {
  //  const recipeId = this.newBookRecipeRecipeIdRef.current.value
  //  let data = new FormData()
  //  data.append("book_recipe[recipe_id]", recipeId)
  //  ajax({url: gon.book_book_recipes_path, type: 'POST', data: data, success: (book_recipe) => {
  //    this.setState({book_recipes: [...this.state.book_recipes, book_recipe]})
  //  }})
  //}
    
  addNewRecipe(name) {
    let data = new FormData()
    data.append("book_recipe_name", name)
    ajax({url: create_new_recipe_book_path(this.state.book), type: 'POST', data: data, success: (book_recipe) => {
      this.setState({book_recipes: [...this.state.book_recipes, book_recipe]})
    }})
  }
  createBookRecipe(recipe) {
    let data = new FormData()
    data.append("book_recipe[recipe_id]", recipe.id)
    ajax({url: book_recipes_book_path(this.state.book), type: 'POST', data: data, success: (book_recipe) => {
      this.setState({book_recipes: [...this.state.book_recipes, book_recipe]})
    }})
  }

  handleDrop({source, destination, type, draggableId}) {
    if (!destination) return; // Ignore drop outside droppable container
    
    if (type == "RECIPE") {
      let recipe_id = draggableId.substr(12) // removes "drag-recipe-"
      let section_id = destination.droppableId == "recipes-container" ? null : destination.droppableId.substr(13) // removes "drop-section-"

      //const insertInList = (list, item) => {
      //  return [...list].map(el => {
      //    if (el.position >= item.position) { el.position = el.position+1 }
      //    return el
      //  })
      //}
      //const removeFromList = (list, item) => {
      //  return [...list].map(el => {
      //    if (el.position > item.position) { el.position = el.position-1 }
      //    return el
      //  })
      //}

      //let recipe = {...this.state.book_recipes.find(r => r.id == recipe_id)}
      //let previousList = this.state.book_recipes.filter(r => r.book_section_id == recipe.book_section_id)
      //let currentList = this.state.book_recipes.filter(r => r.book_section_id == section_id)

      //removeFromList(previousList, recipe)
      //recipe.book_section_id = section_id
      //recipe.position = destination.index+1
      //insertInList(currentList, recipe)
      
      let moved = {...this.state.book_recipes.find(r => r.id == recipe_id)}

      let book_recipes = [...this.state.book_recipes].map(recipe => {
        if (recipe.id == recipe_id) {
          recipe.book_section_id = section_id
          recipe.position = destination.index+1
        } else {
          if (recipe.book_section_id == moved.book_section_id && recipe.position >= moved.position) {
            recipe.position -= 1 // If the recipe is above where the moved one previously was.
          }
          // I don't understand how it works, but it works. This recipe.position must be after.
          if (recipe.book_section_id == section_id && recipe.position >= destination.index+1) {
            recipe.position += 1 // If the recipe is now after the moved one.
          }
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

      var updatedList = [...this.state.book_sections];
      const [reorderedItem] = updatedList.splice(source.index, 1);
      updatedList.splice(destination.index, 0, reorderedItem);

      let data = new FormData()
      data.append('moved_id', section_id)
      data.append('position', destination.index+1)
      ajax({url: gon.move_book_section_url, type: 'PATCH', data: data})
      this.setState({book_sections: updatedList})
    }
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
    let bookRecipesId = this.state.book_recipes.map(r => r.recipe.id)

    let userRecipes = gon.user_recipes.filter(r => !bookRecipesId.includes(r.id))
    
    return (<>
      <div style={{maxWidth: "900px", margin: "auto"}}>
        <div style={{width: "fit-content", margin: "auto"}}>
          <div>
            <br/><br/>
            <div className="d-block d-sm-flex gap-20 text-center">
              <UploadableImage image={book.image} onDelete={onImageDelete} defaultPath="/books/default01.jpg" variant="small_book" width="235" />
              <div style={{minWidth: "15em"}}>
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
        <h1>Recettes</h1>
        <hr/>
        <Show cond={isBlank(this.state.book_recipes)}>
          <p>Aucune recette pour l'instant</p>
        </Show>
        <div ref={this.recipeFindRef} />
        <ul>
          <DragDropContext onDragEnd={(droppedItem) => this.handleDrop(droppedItem)}>
            <Droppable droppableId="sections-container" type="SECTION">
              {(provided) => (<>
                <div className="sections-container" {...provided.droppableProps} ref={provided.innerRef}>
                  {this.state.book_sections.map((section, index) => {
                    let isLast = index - 1 == this.state.book_sections.length
                    return (<Draggable key={`drag-section-${section.id}`} draggableId={`drag-section-${section.id.toString()}`} index={index}>
                      {(provided) => (<>
                        <div className="item-container" ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
                          <li className="section">
                            <h3 key={section.id} style={{margin: "0", padding: "0.5em 0 0.2em 0"}}>
                              <TextField model={section} field="name" className="plain-input" inputRef={this.newBookSectionNameRef} />
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
                                        <span>&nbsp;(<PercentageCompleted recipe={book_recipe.recipe}/>)</span>
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
                    </Draggable>)
                  })}
                  {provided.placeholder}
                </div>
              </>)}
            </Droppable>
            <Droppable droppableId="recipes-container" type="RECIPE">
              {(provided) => (<>
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Show cond={!isBlank(this.state.book_recipes.filter(r => !r.book_section_id))}>
                    <h3 style={{margin: "0", padding: "0.5em 0 0.2em 0"}}>
                      Autres recettes
                    </h3>
                  </Show>
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
        <AddNewRecipe show={this.state.show_add_new_recipe} addNewRecipe={this.addNewRecipe} />
        <AddExistingRecipe recipes={userRecipes} btnRef={this.addExistingRecipeBtnRef} createBookRecipe={this.createBookRecipe} />
        <br/>
        <div className="dropdown" style={{padding: "0 1em"}}>
          <img data-bs-toggle="dropdown" style={{cursor: "pointer"}} width="24" src="/icons/plus-circle.svg"/>
          <div className="dropdown-menu" style={{fontSize: "1.1em"}}>
            <button className="dropdown-item" type="button" className="d-block plain-btn" onClick={this.appendSection}>
              Ajouter une section
            </button>
            <button ref={this.addExistingRecipeBtnRef} className="dropdown-item" type="button" className="d-block plain-btn">
              Ajouter une recette existante
            </button>
            <button className="dropdown-item" type="button" className="d-block plain-btn" onClick={() => {this.setState({show_add_new_recipe: !this.state.show_add_new_recipe})}}>
              Ajouter une nouvelle recette
            </button>
          </div>
        </div>
      </div>
      <div style={{minHeight: "60vh"}}></div>
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

//const RecipeKindFinder = ({onRecipeKindFound}) => {
//  const [value, setValue] = useState('')
//  const [suggestions, setSuggestions] = useState([])
//
//  const inputFieldProps = {
//    placeholder: "Trouver une sorte de recette",
//    value,
//    onChange: (e, {newValue}) => setValue(newValue),
//    //ref: foodInputField,
//  };
//
//  const setModel = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
//    console.log("Setting model!")
//    onRecipeKindFound(suggestion.id)
//    //updateAttributes({modelId: suggestion.id, linkName: suggestionValue})
//  }
//  
//  return (
//    <Autosuggest
//      suggestions={suggestions}
//      onSuggestionsFetchRequested={({value}) => {
//        const inputValue = value.trim().toLowerCase();
//        const inputLength = inputValue.length;
//       
//        const matched = inputLength === 0 ? [] : gon.recipe_kinds.filter(model =>
//          model.name.includes(inputValue)
//        )
//        // Order the matches by relevance?
//        setSuggestions(matched)
//      }}
//      onSuggestionsClearRequested={() => setSuggestions([])}
//      getSuggestionValue={suggestion => suggestion.name}
//      renderSuggestion={(suggestion, { isHighlighted }) => (
//        <div style={{ background: isHighlighted ? '#4095bf' : 'white', color: isHighlighted ? 'white' : 'black' }}>
//          {suggestion.name}
//        </div>
//      )}
//      onSuggestionSelected={setModel}
//      inputProps={inputFieldProps}
//    />
//  )
//}
