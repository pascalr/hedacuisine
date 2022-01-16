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
import { colorToHexString, hexStringToColor, Utils } from 'utils'

class BookAppearanceEditor extends React.Component {
  
  constructor(props) {
    super(props);
    //this.recipeFindRef = React.createRef();
    this.state = {
      book: gon.book,
    };
    this.state.book.onUpdate = (book) => this.setState({book})
    //this.handleDropIng = this.handleDropIng.bind(this);
  }

  render() {

    const book = this.state.book

    console.log("book", book)
    const style = {
      backgroundColor: colorToHexString(book.background_color),
      color: colorToHexString(book.front_page_text_color),
    }

    return (<>
      <Row>
        <Block flexGrow="1">
          <h2>Live preview</h2>
          <div>
            <div className="page title-page" style={style}>
              <div className="book-title"><span>{book.name}</span></div>
              <div className="author">de {gon.user.name}</div>
            </div>
          </div>
        </Block>
        <Block flexGrow="1">
          <h2>Informations</h2>
          <table className="table table-light">
            <tbody>
              <tr>
                <th><label htmlFor="book_name">Name</label></th>
                <td><TextField model={book} field="name"/></td>
              </tr>
              <tr>
                <th><label htmlFor="book_book_format_id">Book format</label></th>
                <td><CollectionSelect model={book} field="book_format_id" options={gon.book_formats.map(k => k.id)} showOption={(id) => gon.book_formats.find(k => k.id == id).name} /></td>
              </tr>
              <tr>
                <th><label htmlFor="book_front_page_text_color">Front page text color</label></th>
                <td><ColorField model={book} field="front_page_text_color"/></td>
              </tr>
              <tr>
                <th><label htmlFor="book_background_color">Background color</label></th>
                <td><ColorField model={book} field="background_color"/></td>
              </tr>
              <tr>
                <th><label htmlFor="book_front_page_image_id">Front page image</label></th>
                <td><ImageField model={book} imageAttr="front_page_image" field="front_page_image_id" /></td>
              </tr>
            </tbody>
          </table>
        </Block>
      </Row>
    </>)
  }
}

document.addEventListener('DOMContentLoaded', () => {

  const root = document.getElementById('root')
  if (root) {ReactDOM.render(<BookAppearanceEditor />, root)}
})
