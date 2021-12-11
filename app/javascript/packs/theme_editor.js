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

import {Model, TextFieldTag, HiddenFieldTag, SubmitTag, TextInputField, TextAreaField, CollectionSelect, MODEL_BOOK_RECIPE, ColorField} from '../form'

class ThemeEditor extends React.Component {
  
  constructor(props) {
    super(props);
    //this.recipeFindRef = React.createRef();
    //this.state = {
    //  name: gon.recipe.name,
    //};
    //this.handleDropIng = this.handleDropIng.bind(this);
  }

  render() {

    //<TextFieldTag field="book_recipe[recipe_id}"/>
    //<HiddenFieldTag field="book_id" value={gon.book.id}/>
    //<SubmitTag value="Ajouter"/>
    //<tr>
    //  <th>Ingrédient principal</th>
    //  <td><CollectionSelect model={MODEL_THEME} field="main_ingredient_id" options={this.state.ingIds} showOption={(ingId) => gon.recipe.ingredients[ingId].food.name} includeBlank="true"></CollectionSelect></td>
    //<tr>
    //  <th>Sorte de recette</th>
    //  <td><CollectionSelect model={MODEL_THEME} field="recipe_kind_id" options={gon.recipe_kinds.map(k => k.id)} showOption={(id) => gon.recipe_kinds.find(k => k.id == id).name} includeBlank="true"></CollectionSelect></td>
    //</tr>
    //</tr>
    return (<>
      <h2>Informations</h2>
      <table className="table table-light" style={{width: "600px"}}>
        <tbody>
          <tr>
            <th><label htmlFor="theme_background_color">Background color</label></th>
            <td><ColorField model={gon.theme} field="background_color"/></td>
          </tr>
          <tr>
            <th><label htmlFor="theme_text_color">Text color</label></th>
            <td><ColorField model={gon.theme} field="text_color"/></td>
          </tr>
          <tr>
            <th><label htmlFor="theme_page_separator_color">Page separator color</label></th>
            <td><ColorField model={gon.theme} field="page_separator_color"/></td>
          </tr>
        </tbody>
      </table>
    </>)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  //const modHandler = new ModificationsHandler()
  //window.registerEditor = (editor, model, field, url) => {
  //  modHandler.registerEditor(editor, model, field, url)
  //}

  const root = document.getElementById('root')
  if (root) {ReactDOM.render(<ThemeEditor/>, root)}
})
