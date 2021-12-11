import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { colorToHexString, hexStringToColor, Utils } from 'utils'

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
    const themeClass = "theme-"+theme.name.toLowerCase().replace(/ /, '-')
    const book = {name: theme.name + " theme"}
    return (<>
      <style>{`
        .${themeClass} * {
          color: ${colorToHexString(theme.text_color)};
        }
        .${themeClass} .page {
          background-color: ${colorToHexString(theme.background_color)};
        }
        .${themeClass} .page + .page {
          border-top: 4px solid ${colorToHexString(theme.page_separator_color)};
        }
        .${themeClass} .index-page a, .theme-light .title-page a {
          color: ${colorToHexString(theme.text_color)}
        }
        .${themeClass} .index-page a:hover {
          color: #444;
        }
      `}</style>
      <Row>
        <div>
          <h2>Informations</h2>
          <table className="table table-light" style={{width: "600px"}}>
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
        </div>
        <div>
          <h2>Live preview</h2>
          <div className={themeClass}>
            <div className="page title-page">
              <h1>{book.name}</h1>
              <div className="author">de {gon.user.name}</div>
            </div>
          </div>
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
  if (root) {ReactDOM.render(<ThemeEditor />, root)}
})
