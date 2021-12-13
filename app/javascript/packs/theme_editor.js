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

import {ColorField, TextField} from '../form'
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
                <th><label htmlFor="theme_page_separator_color">Page separator color</label></th>
                <td><ColorField model={theme} field="page_separator_color"/></td>
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
