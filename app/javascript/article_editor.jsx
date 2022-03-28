import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'

//import Quantity from 'models/quantity'

import { ArticleTiptap, ModificationsHandler } from './tiptap'

class ArticleEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (<>
      <ArticleTiptap model="article" json_field="json" html_field="html" url={gon.article.url}/>
    </>)
  }
}

document.addEventListener('DOMContentLoaded', () => {

  const modHandler = new ModificationsHandler()
  window.registerEditor = (editor, model, json_field, html_field, url) => {
    modHandler.registerEditor(editor, model, json_field, html_field, url)
  }

  const root = document.getElementById('root')
  if (root) {ReactDOM.render(<ArticleEditor/>, root)}
})
