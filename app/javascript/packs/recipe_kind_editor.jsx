import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'

//import Quantity from 'models/quantity'
//import { Ingredient, Utils } from "recipe_utils"

import { DescriptionTiptap, ModificationsHandler } from 'tiptap'
import '../styles/prose_mirror.scss'

class RecipeKindEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (<>
      <DescriptionTiptap content={gon.recipe_kind.description} model="recipe_kind" field="description" url={gon.recipe_kind.url}/>
    </>)
  }
}

document.addEventListener('DOMContentLoaded', () => {

  const modHandler = new ModificationsHandler()
  window.registerEditor = (editor, model, field, url) => {
    modHandler.registerEditor(editor, model, field, url)
  }

  const root = document.getElementById('root')
  if (root) {ReactDOM.render(<RecipeKindEditor/>, root)}
})
