import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Autosuggest from 'react-autosuggest'
import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'

import Quantity from './models/quantity'
import { ajax } from "./utils"
import { DeleteConfirmButton } from './components/delete_confirm_button'
import { Tiptap, BubbleTiptap, ModificationsHandler } from './tiptap'
import {AutocompleteInput, updateRecord, TextField, CollectionSelect} from './form'
import { combineOrderedListWithHeaders } from './lib'
import {EditRecipeImageModal} from './modals/recipe_image'
import {PasteIngredientsButton} from './modals/paste_ingredients'
import {EditMix} from './app'

import {paste_ingredients_recipes_path, recipe_recipe_ingredients_path, recipe_recipe_ingredient_path, food_path, recipe_ingredient_sections_path, recipe_ingredient_section_path, recipe_recipe_notes_path, move_ing_recipe_path, recipe_path, recipe_recipe_note_path, image_variant_path, mixes_path, mix_path } from './routes'

const InstructionsShortcuts = props => (
  <>
    <button type="button" className="btn btn-small dropdown-toggle" data-bs-toggle="collapse" data-bs-target="#show-shortcuts">
      Voir les racourcis claviers
    </button>
    <div className="collapse" id="show-shortcuts">
      <h2>Racourcis claviers</h2>
      <ul>
        <li><b>#</b>: Commencer une ligne avec «#» pour chaque étape de la recette.</li>
        <li><b>$</b>: Commencer une ligne avec «$» pour un grand titre.</li>
        <li><b>$$</b>: Commencer une ligne avec «$$» pour un moyen titre.</li>
        <li><b>$$$</b>: Commencer une ligne avec «$$$» pour un petit titre.</li>
        <li><b>/</b>: Commencer une ligne avec «/» pour faire un paragraph en italique.</li>
        <li><b>{"{3}"}</b>: Afficher l'ingrédient 3</li>
        <li><b>{"{3-5}"}</b>: Afficher les ingrédients 3, 4 et 5</li>
        <li><b>{"{3,5}"}</b>: Afficher les ingrédients 3 et 5</li>
        <li><b>{"{3;}"}</b>: TODO: Afficher le nombre 3 qui scale avec la recette</li>
        <li><b>{"{3;pomme}"}</b>: TODO: Afficher la quantité 3 pomme qui scale avec la recette</li>
        <li><b>{"{2;pomme,3-5}"}</b>: TODO: Afficher la quantité 3 pomme qui scale avec la recette et les ingrédients 3, 4 et 5.</li>
        <li><b>[1]</b>: TODO: Lien vers la note 1</li>
        <li><b>[1;Section name]</b>: TODO: Lien vers la section de l'article</li>
        <li><b>[note: 1]</b></li>
        <li><b>[link_note: 1]</b></li>
        <li><b>[recipe: 100]</b></li>
        <li><b>[food: 100]</b></li>
        <li><b>[url: "http://www.hedacuisine.com/"]</b></li>
        <li><b>[label: "home", url: "http://www.hedacuisine.com/"]</b></li>
        <li><b>[img: 10]</b></li>
      </ul>
    </div>
  </>
)

const NewIngInputField = props => {

  const [value, setValue] = useState('')
  const [qty, setQty] = useState('')
  const [newlyAdded, setNewlyAdded] = useState(true);

  //const foodInputField = useRef(null);
  const quantityInputField = useRef(null);

  const id = "autocomplete-form"

  useEffect(() => {
    if (newlyAdded) {
      quantityInputField.current.focus()
      setNewlyAdded(false)
    }
  }, [newlyAdded]);

  const inputFieldProps = {
    placeholder: 'Sélectionner un aliment',
    value,
    id: 'newRecipeIngredientRawFood',
    onChange: (e, {newValue}) => setValue(newValue),
    //ref: foodInputField,
  };

  const postNewIngredient = (data) => {
      
    ajax({url: recipe_recipe_ingredients_path(gon.recipe), type: 'POST', data: data, success: (ingredient) => {
      window.recipe_editor.current.addIng(ingredient)
      setValue(''); setQty('');
      quantityInputField.current.focus()
    }})
  }

  //const addIngredient = (event, {suggestion, suggestionValue, suggestionIndex, sectionIndex, method}) => {
  //  let data = new FormData()
  //  data.append('recipe_ingredient[raw]', qty)
  //  data.append('recipe_ingredient[food_id]', suggestion.id)
  //  postNewIngredient(data)
  //}

  const handleSubmit = (e) => {
    e.preventDefault()
    let data = new FormData()
    data.append('recipe_ingredient[raw]', qty)
    data.append('recipe_ingredient[raw_food]', e.currentTarget.elements.raw_food.value)
    postNewIngredient(data)
  }

  const onSelect = (e, term, item) => {
    e.preventDefault()
    let data = new FormData()
    let form = document.getElementById(id)
    data.append('recipe_ingredient[raw]', form.elements.raw.value)
    let f = props.foods.find(e => e.id == item.dataset.id)
    data.append('recipe_ingredient[raw_food]', f.name)
    postNewIngredient(data)
  }

  return (<>
    <form id={id} onSubmit={handleSubmit}>
      <Row gap="0.5em;">
        <input type="text" name="raw" size="8" style={{border: "none", borderBottom: "1px dashed #444"}} value={qty} onChange={(e) => setQty(e.target.value)} ref={quantityInputField} />
        {' '}
        de
        {' '}
        <input type="hidden" name="food_id" value="" />
        <AutocompleteInput name="raw_food" choices={props.foods} onSelect={onSelect} />
        <input type="submit" value="Ajouter" />
      </Row>
    </form>
  </>)
}

const VisualState = {
  CLOSED: 1,
  EXPANDING: 2,
  EXPANDED: 3,
}

// props: {comment}
const EditableIngredientComment = (props) => {

  //const [comment, setComment] = useState(props.comment);
  const [visual, setVisual] = useState(props.commentJson && props.commentJson != '' ? VisualState.EXPANDED : VisualState.CLOSED);

  //const commentInput = useRef(null);

  useEffect(() => {
    if (visual == VisualState.EXPANDING) {
      setVisual(VisualState.EXPANDED)
      //commentInput.current.focus()
    }
  }, [visual]);

  //const updateComment = () => {
  //  if (comment != props.comment) {
  //    let data = new FormData()
  //    data.append('recipe_ingredient[comment]', comment)
  //    Rails.ajax({url: props.ingUrl, type: 'PATCH', data: data})
  //  }
  //  if (!comment || comment == '') {
  //    setVisual(VisualState.CLOSED)
  //  }
  //}

  const closeIfEmpty = () => {
  }

  if (visual == VisualState.CLOSED) {
    return (
      <button type="button" className="btn-image" onClick={() => setVisual(VisualState.EXPANDING)}>
        <img src="/icons/chat-left.svg" style={{marginLeft: "10px"}}/>
      </button>
    )
  } else {
    const style = {transition: "width 0.4s ease-in-out"}
    style.width = visual == VisualState.EXPANDED ? "200px" : "0px"
    return (
      <Row marginLeft="10px" style={style} onBlur={closeIfEmpty}>
        <BubbleTiptap content={JSON.parse(props.commentJson)} model="recipe_ingredient" json_field="comment_json" html_field="comment_html" url={props.ingUrl}/>
      </Row>
    )
    //(<input type="text" value={comment || ''} style={style} ref={commentInput} onChange={(e) => setComment(e.target.value)} onBlur={updateComment} />)
  }
}

const EditableIngredient = ({ingredient, foods, mixes}) => {

  if (ingredient == null) {return null;}

  const ingUrl = recipe_recipe_ingredient_path({id: ingredient.recipe_id}, ingredient)
  const removeIngredient = (evt) => {
    ajax({url: ingUrl, type: 'DELETE', success: () => {
      window.recipe_editor.current.removeIng(ingredient)
    }})
  }

  let f = ingredient.food_id ? foods.find(e => e.id == ingredient.food_id) : null
  let mix = mixes.find(e => e.recipe_id == gon.recipe.id)

  let moveIngToMix = () => {
    let ins = mix.instructions+';ADD,'+ingredient.raw+','+(f ? f.name : ingredient.name)
    ajax({url: mix_path(mix), type: 'PATCH', data: {mix: {instructions: ins}}, success: (mix) => {
      mixes.update(mixes.map(e => e.id == mix.id ? mix : e))
      removeIngredient()
    }})
  }

  return (
    <Row alignItems="center" gap="5px">
      <span style={{padding: "0 10px 0 0"}}><b>{ingredient.item_nb}.</b></span>
      <TextField model={ingredient} field="raw" size="8" className="editable-input" />
      de{/*" de " ou bien " - " si la quantité n'a pas d'unité => _1_____ - oeuf*/}
      {f ? <a href={food_path(f)}>{f.name}</a> : <div>{ingredient.name}</div>}
      <EditableIngredientComment ingUrl={ingUrl} commentJson={ingredient.comment_json} />
      <Block flexGrow="1" />
      {mix ? <img className="clickable" style={{marginRight: '0.4em'}} src="/icons/arrow-down-up.svg" width="16" height="16" onClick={moveIngToMix}></img> : '' }
      <DeleteConfirmButton id={`ing-${ingredient.id}`} onDeleteConfirm={removeIngredient} message="Je veux enlever cet ingrédient?" />
    </Row>
  )
}

const Toggleable = ({children, ...props}) => {
  const [showToggled, setShowToggled] = useState(false)

  if (children.length <= 1) {throw "Toggleable requires 2 or 3 children. The first is the toggled. The second is the toggler. The third, if present, is the toggler active."}

  // TODO: Allow to be a div or link instead of a button? Who cares for now.
  return (<div {...props}>
    {showToggled ? children[0] : null}
    <button className="plain-btn" onClick={() => setShowToggled(!showToggled)}>
      {!showToggled ? children[1] : (children.length >= 2 ? children[2] : children[1])}
    </button>
  </div>)
}

export class RecipeEditor extends React.Component {
  
  constructor(props) {
    super(props);
    let noteIds = gon.recipe.notes ? Object.values(gon.recipe.notes).sort((a,b) => a.item_nb - b.item_nb).map(ing => ing.id) : []
    let recipe_image = gon.recipe.image_id ? gon.images.find(e => e.id == gon.recipe.image_id) : {}
    this.state = {
      recipe: gon.recipe,
      recipe_image: recipe_image,
      name: gon.recipe.name,
      ingredients: gon.recipe_ingredients.filter(e => e.recipe_id == gon.recipe.id) || [],
      noteIds: noteIds,
      ingredient_sections: gon.ingredient_sections || [],
      toolIds: Object.keys(gon.recipe.tools || []),
      instructionsSlave: gon.recipe.complete_instructions,
      showImageModal: false,
    };
    //this.state.recipe.recipe_image.onUpdate = () => {
    //  throw "TODO: Image onUpdate"
    //  recipe = {...this.state.recipe}
    //  recipe.recipe_image 
    //  this.setStete
    //}
    this.state.recipe.onUpdate = (recipe) => {this.setState({recipe})}
    this.state.recipe.onServerUpdate = ({recipe, recipe_image}) => {
      //console.log("recipe", recipe)
      //console.log("recipe_image", recipe_image)
      //if (!this.state.recipe_image.url && recipe_image && recipe_image.url) {
      //  this.setState({recipe_image: {...this.state.recipe_image, ...recipe_image}})
        this.setState({recipe_image: updateRecord(this.state.recipe_image, recipe_image)})
      //}
    }
    this.state.recipe_image.onUpdate = (recipe_image) => {this.setState({recipe_image})}
    this.state.recipe_image.onServerUpdate = (image) => {
      this.setState({recipe_image: updateRecord(this.state.recipe_image, image)})
    }
    this.handleDropIng = this.handleDropIng.bind(this);
    this.appendIngredientSection = this.appendIngredientSection.bind(this)
    this.addIng = this.addIng.bind(this)
    this.removeIng = this.removeIng.bind(this)
    this.removeIngSection = this.removeIngSection.bind(this)
    this.appendNote = this.appendNote.bind(this)
    this.pasteIngredients = this.pasteIngredients.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.ingredients !== this.state.ingredients) {
      gon.recipe_ingredients = this.state.ingredients
    }
  }

  //swapIng(dragIndex, dropIndex) {
  //  let swappedIngs = swapArrayPositions(this.state.ings, dragIndex, dropIndex);
  //  this.setState({ings: swappedIngs})
  //}

  addIng(ingredient) {
    console.log("added ingredient ", ingredient)
    this.setState({ingredients: [...this.state.ingredients, ingredient]})
  }
  removeIng(ing) {
    console.log("this.state.ingredients", this.state.ingredients)
    let ings = this.state.ingredients.filter(item => item.id != ing.id)
    console.log("ings", ings)
    this.setState({ingredients: ings})
  }

  appendIngredientSection() {
    ajax({url: recipe_ingredient_sections_path(gon.recipe), type: 'POST', data: {}, success: (section) => {
      this.setState({ingredient_sections: [...this.state.ingredient_sections, section]})
    }})
  }

  pasteIngredients(text) {
    ajax({url: paste_ingredients_recipes_path(this.state.recipe), type: 'PATCH',
          data: {pasted: text}, success: ({ingredients}) => {
      this.setState({ingredients})
    }})
  }

  appendNote() {
    ajax({url: recipe_recipe_notes_path(gon.recipe), type: 'POST', data: {}, success: (recipe_note) => {
      if (!gon.recipe.notes) {gon.recipe.notes = {}}
      gon.recipe.notes[recipe_note.id] = recipe_note
      this.setState({noteIds: [...this.state.noteIds, recipe_note.id]})
    }})
  }

  handleDropIng(ingItems, droppedItem) {

    const getClosestItemNb = (index) => {
      for (let i = index; i < ingItems.length; i++) {
        if (ingItems[i].class_name == "recipe_ingredient") {
          return ingItems[i].item_nb
        }
      }
      return this.state.ingredients.length
    }

    console.log('Handle drop ing')
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    let source = getClosestItemNb(droppedItem.source.index)-1
    let destination = getClosestItemNb(droppedItem.destination.index)-1
    let droppedRecord = ingItems[droppedItem.source.index]
    //console.log("droppedRecord", droppedRecord)
    //console.log("droppedItem", droppedItem)
    //console.log("source", source)
    //console.log("destination", destination)
    if (droppedRecord.class_name == "recipe_ingredient") {
      console.log("dropping recipe ingredient")
      var updatedList = [...this.state.ingredients];
      const [reorderedItem] = updatedList.splice(source, 1);
      updatedList.splice(destination, 0, reorderedItem);

      let data = new FormData()
      data.append('ing_id', droppedRecord.id)
      data.append('position', destination+1)
      ajax({url: move_ing_recipe_path(gon.recipe), type: 'PATCH', data: data})
      for (let i = 0; i < updatedList.length; i++) {
        updatedList[i].item_nb = i+1
      }
      this.setState({ingredients: updatedList})
    } else {
      var others = [...this.state.ingredient_sections].filter(i => i.id != droppedRecord.id);
      droppedRecord.before_ing_nb = droppedItem.source.index < droppedItem.destination.index ? destination+2 : destination+1
      console.log("dropping ingredient section at ", droppedRecord.before_ing_nb)
      let data = new FormData()
      data.append('ingredient_section[before_ing_nb]', droppedRecord.before_ing_nb)
      ajax({url: recipe_ingredient_section_path({id: droppedRecord.recipe_id}, droppedRecord), type: 'PATCH', data: data})
      this.setState({ingredient_sections: [...others, droppedRecord]})
    }
  }

  removeIngSection(section) {
    ajax({url: recipe_ingredient_section_path({id: section.recipe_id}, section), type: 'DELETE', success: () => {
      let sections = this.state.ingredient_sections.filter(i => i.id != section.id)
      this.setState({ingredient_sections: sections})
    }})
  }

  render() {

    const {page, userRecipes, favoriteRecipes, machines, mixes, machineFoods, foods} = this.props

    let ingItems = combineOrderedListWithHeaders(this.state.ingredients, this.state.ingredient_sections, header => header.before_ing_nb)
    console.log('this.state.ingredients', this.state.ingredients)
    ingItems = ingItems.concat(this.state.ingredient_sections.filter(s => s.before_ing_nb > this.state.ingredients.length))
    const renderedIngItems = []
    for (let i=0; i < ingItems.length; i++) {
      let item = ingItems[i]
      if (item.class_name == "ingredient_section") {
        let sectionId = 'section-'+item.id
        renderedIngItems.push(<Draggable key={sectionId} draggableId={sectionId} index={i}>
          {(provided) => (
            <div className="item-container" ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
              <h3 style={{margin: "0", padding: "0.5em 0 0.2em 0"}}>
                <TextField model={item} field="name" className="plain-input" url={recipe_ingredient_section_path({id: item.recipe_id}, {id: item.id})} />
                <span style={{margin: "0 0.2em"}}>
                  <DeleteConfirmButton id={`del-${sectionId}`} onDeleteConfirm={() => this.removeIngSection(item)} message="Je veux enlever ce titre?" />
                </span>
              </h3>
            </div>
          )}
        </Draggable>)
      } else {
        renderedIngItems.push(<Draggable key={item.id} draggableId={item.id.toString()} index={i}>
          {(provided) => (
            <div className="item-container" ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
              <li className="list-group-item">
                {<EditableIngredient ingredient={item} {...{mixes, foods}} />}
              </li>
            </div>
          )}
        </Draggable>)
      }
    }

    const IngredientList = 
      <ul className="list-group" style={{maxWidth: "800px"}}>
        <DragDropContext onDragEnd={(droppedItem) => this.handleDropIng(ingItems, droppedItem)}>
          <Droppable droppableId="list-container">
            {(provided) => (
              <div className="list-container" {...provided.droppableProps} ref={provided.innerRef}>
                {renderedIngItems}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Row>
          <Toggleable style={{float: "left"}}>
            <li key={99999} className="list-group-item" style={{height: "37.2px"}}>
              <NewIngInputField {...{foods}} />
            </li>
            <img src="/icons/plus-circle.svg" style={{width: "2.5rem", padding: "0.5rem"}}/>
            <img src="/icons/minus-circle.svg" style={{width: "2.5rem", padding: "0.5rem"}}/>
          </Toggleable>
          <PasteIngredientsButton ingredients={this.state.ingredients} handleSubmit={this.pasteIngredients} />
        </Row>
      </ul>

    const NoteList = this.state.noteIds.map(id => {
      const note = gon.recipe.notes[id]

      const removeNote = (evt) => {
        ajax({url: recipe_recipe_note_path(gon.recipe, note), type: 'DELETE', success: () => {
          let ids = this.state.noteIds.filter(item => item != note.id)
          this.setState({noteIds: ids})
          delete gon.recipe.notes[note.id]
        }})
      }

      return (
        <Row key={id} gap="5px" marginBottom="5px">
          [{note.item_nb}]
          <Block flexGrow="1">
            <BubbleTiptap content={JSON.parse(note.json)} model="recipe_note" json_field="json" html_field="html" url={recipe_recipe_note_path(gon.recipe, note)} />
          </Block>
          <DeleteConfirmButton id={`note-${note.id}`} onDeleteConfirm={removeNote} message="Je veux enlever cette note?" />
        </Row>
      )
    })

    const Tools = this.state.toolIds.map(id => (
      <li key={id}>
        {gon.recipe.tools[id].name}
      </li>
    ))

    const recipe = this.state.recipe
    const recipe_kind = gon.recipe_kinds.find(k => k.id == recipe.recipe_kind_id)
    const recipe_image = this.state.recipe_image
    let recipeKindImage = recipe_kind && recipe_kind.image_id ? gon.images.find(e => e.id == recipe_kind.image_id) : null
    const image = recipe.use_personalised_image ? recipe_image : recipeKindImage
    //console.log('use_personalised_image', recipe.use_personalised_image)
    //console.log('recipe kind image', recipeKindImage)
    //console.log('recipe kind', recipe_kind)
    //console.log('recipe image', recipe_image)
    const imagePath = image ? image_variant_path(image, 'medium') : "/default_recipe_01.png"
    //console.log(model)
    const mix = mixes.find(m => m.recipe_id == recipe.id)

    const createMix = () => {
      ajax({url: mixes_path(), type: 'POST', data: {mix: {recipe_id: recipe.id}}, success: (mix) => {
        mixes.update([...mixes, mix])
      }})
    }
  
    let mixEditor = mix ? <EditMix {...{page, userRecipes, favoriteRecipes, machines, mixes, machineFoods}} /> : (<>
      <p>Vous pouvez ajouter des instructions pour automatiser cette recette.</p>
      <button type="button" className="btn btn-primary" onClick={createMix}>Ajouter</button>
    </>)
    
    return (<>
      <div className="d-block d-md-flex gap-20">
        <div>
          <div className="over-container">
            <EditRecipeImageModal recipe={recipe} show={this.state.showImageModal}
                                  handleClose={() => this.setState({showImageModal: false})}
                                  recipeImage={recipe_image} recipeKindImage={recipeKindImage} />
            <div style={{cursor: "pointer"}} onClick={() => this.setState({showImageModal: true})}>
              <img style={{maxWidth: "100vh", height: "auto"}} src={imagePath} width="452" height="304"/>
              <div className="bottom-right" style={{color: 'white', fontSize: '2em'}}>
                <img src="/icons/pencil-circle.svg" style={{width: "5rem", padding: "0.5rem"}}/>
              </div>
            </div>
          </div> 
        </div>
        <div style={{width: '100%'}}>
          <h1>
            <span className="recipe-title">
              <TextField model={recipe} field="name" className="plain-input" />
            </span>
          </h1>
          <div>
            <b>Préparation (minutes): </b>
            <span style={{color: 'gray'}}>
              <TextField model={recipe} field="preparation_time" className="editable-input" />
            </span>
          </div>
          <div>
            <b>Cuisson (minutes): </b>
            <span style={{color: 'gray'}}>
              <TextField model={recipe} field="cooking_time" className="editable-input" />
            </span>
          </div>
          <div>
            <b>Total (minutes): </b>
            <span style={{color: 'gray'}}>
              <TextField model={recipe} field="total_time" className="editable-input" />
            </span>
          </div>
          <div>
            <b>Portions: </b>
            <span style={{color: 'gray'}}>
              <TextField model={recipe} field="raw_servings" className="editable-input" />
            </span>
          </div>
        </div>
      </div>
      <div className="recipe-body">
        
        <h2>Commandes</h2>
        {mixEditor}

        <div style={{display: 'flex', alignItems: 'baseline'}}>
          <h2 style={{flexGrow: '1'}}>Ingrédients</h2>
          <div className="dropstart" style={{padding: "0 1em"}}>
            <img data-bs-toggle="dropdown" style={{cursor: "pointer"}} src="/icons/list.svg"/>
            <div className="dropdown-menu">
              <button className="dropdown-item" type="button" className="plain-btn" onClick={this.appendIngredientSection}>
                Ajouter une section
              </button>
            </div>
          </div>
        </div>
        {IngredientList}
      
        <h2>Instructions</h2>
        <Tiptap model="recipe" json_field="json" html_field="html" url={recipe_path(gon.recipe)} content={JSON.parse(gon.recipe.json)} />
        <InstructionsShortcuts/>
        
        <h3>Notes</h3>
        {NoteList}
        <button type="button" className="plain-btn" onClick={() => this.appendNote()}>
          <img src="/icons/plus-circle.svg" style={{width: "2.5rem", padding: "0.5rem"}}/>
        </button>
        
        <h2>Outils</h2>
        <ul style={{fontSize: "1.1rem"}}>
          {Tools}
        </ul>
        
        <h2>Informations</h2>
        <table className="table table-light">
          <tbody>
            <tr>
              <th>Ingrédient principal</th>
              <td><CollectionSelect model={recipe} field="main_ingredient_id" options={this.state.ingredients.map(i => i.id)} showOption={(ingId) => this.state.ingredients.filter(i => i.id == ingId).name} includeBlank="true"></CollectionSelect></td>
            </tr>
          </tbody>
        </table>

        <h2>Références</h2>

      </div>
    </>)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.recipe_editor = React.createRef()
  const root = document.getElementById('root')

  const modHandler = new ModificationsHandler()
  window.registerEditor = (editor, model, json_field, html_field, url) => {
    modHandler.registerEditor(editor, model, json_field, html_field, url)
  }

  if (root) {ReactDOM.render(<RecipeEditor ref={window.recipe_editor}/>, root)}
})
