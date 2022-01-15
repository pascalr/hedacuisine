import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'

import {themeCssClass, Theme} from '../models/theme'

//import Quantity from 'models/quantity'
//import { Ingredient, Utils } from "recipe_utils"

import {EditableField, TextField, ToggleField, CollectionSelect} from '../form'

import { BookTiptap, ModificationsHandler } from 'tiptap'
import '../styles/prose_mirror.scss'

class BookEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      book: gon.book,
    }
    this.theme = gon.theme
    this.editorRef = React.createRef();
  }

  render() {
    const book = this.state.book
    const getEditor = () => this.editorRef.current.editor
    return (<>
      <Theme theme={this.theme}/>
      <Row>
        <div style={{width: '200px', height: '90vh', overflowX: 'hidden', overflowY: 'auto'}}>
          <h3>Table des matières</h3>
          {[].map(page => {
            return <div key={`page-${page.id}`}>
              <PageThumbnail pageNb={page.page_nb} />
            </div>
          })}
          <button type="button" className="plain-btn" onClick={() => {getEditor().chain().focus().insertPage().run()}}>
            <img src="/icons/plus-circle.svg" style={{width: "2.5rem", padding: "0.5rem"}}/>
          </button>
        </div>
        <div style={{flexGrow: '1', height: '90vh', overflowX: 'hidden', overflowY: 'auto'}}>
          <div className={`book ${themeCssClass(this.theme)}`}>
            <BookTiptap ref={this.editorRef} model="book" json_field="json" html_field="html" url={gon.book.url}/>
          </div>
        </div>
        <div style={{width: '200px', height: '90vh', overflowX: 'hidden', overflowY: 'auto'}}>
          <h2>Ajouter</h2>
            <button type="button" className="btn btn-primary" onClick={() => {getEditor().chain().focus().insertFloatingText().run()}}>
              <img src="/icons/plus-circle.svg" style={{width: "2.5rem", padding: "0.5rem"}}/>
            </button>
          <h2>Paramètres</h2>

          <a href='#index-page'>Index</a>

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

  const modHandler = new ModificationsHandler()
  window.registerEditor = (editor, model, json_field, html_field, url) => {
    modHandler.registerEditor(editor, model, json_field, html_field, url)
  }

  const root = document.getElementById('root')
  if (root) {ReactDOM.render(<BookEditor/>, root)}
})
