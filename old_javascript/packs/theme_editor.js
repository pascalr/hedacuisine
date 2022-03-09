import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

//import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Autosuggest from 'react-autosuggest'
//
import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'
//
//import Popover from '@mui/material/Popover';
//import Typography from '@mui/material/Typography';
//import Button from '@mui/material/Button';
//
//import Quantity from 'models/quantity'
//import { Ingredient, Utils } from "recipe_utils"

import {ColorField, TextField, ImageField, CollectionSelect} from '../form'
import {themeCssClass, Theme} from '../models/theme'

class ThemeEditor extends React.Component {
  
  constructor(props) {
    super(props);
    //this.recipeFindRef = React.createRef();
    this.state = {
      theme: gon.theme,
    };
    this.state.theme.onUpdate = (theme) => this.setState({theme})
    //this.handleDropIng = this.handleDropIng.bind(this);
  }

  render() {

    const theme = this.state.theme
    const book = {name: theme.name + " theme"}

    return (<>
      <Theme theme={this.state.theme}/>
      <Row>
        <Block flexGrow="1">
          <h2>Informations</h2>
          <table className="table table-light">
            <tbody>
              <tr>
                <th><label htmlFor="theme_name">Name</label></th>
                <td><TextField model={theme} field="name"/></td>
              </tr>
              <tr>
                <th><label htmlFor="theme_book_format_id">Book format</label></th>
                <td><CollectionSelect model={theme} field="book_format_id" options={gon.book_formats.map(k => k.id)} showOption={(id) => gon.book_formats.find(k => k.id == id).name} /></td>
              </tr>
              <tr>
                <th><label htmlFor="theme_font_name">Font name</label></th>
                <td><TextField model={theme} field="font_name"/></td>
              </tr>
              <tr>
                <th><label htmlFor="theme_background_color">Background color</label></th>
                <td><ColorField model={theme} field="background_color"/></td>
              </tr>
              <tr>
                <th><label htmlFor="theme_text_color">Text color</label></th>
                <td><ColorField model={theme} field="text_color"/></td>
              </tr>
              <tr>
                <th><label htmlFor="theme_link_color">Link color</label></th>
                <td><ColorField model={theme} field="link_color"/></td>
              </tr>
              <tr>
                <th><label htmlFor="theme_link_missing_color">Link missing color</label></th>
                <td><ColorField model={theme} field="link_missing_color"/></td>
              </tr>
              <tr>
                <th><label htmlFor="theme_inverted_background_color">Inverted background color</label></th>
                <td><ColorField model={theme} field="inverted_background_color"/></td>
              </tr>
              <tr>
                <th><label htmlFor="theme_inverted_text_color">Inverted text color</label></th>
                <td><ColorField model={theme} field="inverted_text_color"/></td>
              </tr>
              <tr>
                <th><label htmlFor="theme_page_separator_color">Page separator color</label></th>
                <td><ColorField model={theme} field="page_separator_color"/></td>
              </tr>
              <tr>
                <th><label htmlFor="book_front_page_image_id">Front page image</label></th>
                <td><ImageField model={theme} imageAttr="front_page_image" field="front_page_image_id" /></td>
              </tr>
            </tbody>
          </table>
        </Block>
        <Block flexGrow="1">
          <h2>Live preview</h2>
          <div className={themeCssClass(theme)}>
            <div className="page title-page">
              <h1>{book.name}</h1>
              <div className="author">de {gon.user.name}</div>
            </div>
          </div>
        </Block>
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
  if (root) {ReactDOM.render(<ThemeEditor />, root)}
})
