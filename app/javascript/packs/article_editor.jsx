import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'

//import Quantity from 'models/quantity'
//import { Ingredient, Utils } from "recipe_utils"

import { ArticleTiptap, ModificationsHandler } from 'tiptap'
import '../styles/prose_mirror.scss'

class ArticleEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (<>
      <ArticleTiptap model="article" field="content" url={gon.article.url}/>
    </>)
  }
}

document.addEventListener('DOMContentLoaded', () => {

  const modHandler = new ModificationsHandler()
  window.registerEditor = (editor, model, field, url) => {
    modHandler.registerEditor(editor, model, field, url)
  }

  const root = document.getElementById('root')
  if (root) {ReactDOM.render(<ArticleEditor/>, root)}
})
