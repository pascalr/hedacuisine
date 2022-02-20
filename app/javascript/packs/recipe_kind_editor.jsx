import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'

import {UploadableImage} from '../modals/uploadable_image'

import {updateRecord, asyncUpdateModel, TextField} from '../form'

//import Quantity from 'models/quantity'
//import { Ingredient, Utils } from "recipe_utils"

import { DescriptionTiptap, ModificationsHandler } from 'tiptap'
import '../styles/prose_mirror.scss'

class RecipeKindEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      recipe_kind: gon.recipe_kind
    }
    this.state.recipe_kind.image.onServerUpdate = (image) => {
      //let recipe_kind = {...this.state.recipe_kind}
      //recipe_kind.image = updateRecord(recipe_kind.image, image)
      //this.setState(recipe_kind)
      this.setState({recipe_kind: updateRecord(this.state.recipe_kind, {}, {image: image})})
    }
    this.state.recipe_kind.onServerUpdate = (recipe_kind) => {
      //recipe_kind.image.onServerUpdate = this.state.recipe_kind.image.onServerUpdate
      //this.setState({recipe_kind: updateRecord(this.state.recipe_kind, recipe_kind)})
      console.log("this.state.recipe_kind", this.state.recipe_kind)
      console.log("recipe_image", recipe_kind)
      console.log("updateRecord", updateRecord(this.state.recipe_kind, recipe_kind, {image: {}}))
      this.setState({recipe_kind: updateRecord(this.state.recipe_kind, recipe_kind, {image: {}})})
    }
  }

  render() {
    const recipe_kind = this.state.recipe_kind

    const onImageDelete = () => {
      asyncUpdateModel(recipe_kind, {image_id: null})
    }

    return (<>
      <div style={{height: "1em"}}></div>
      <div className="responsive-sm-above" style={{gap: "20px"}}>
        <UploadableImage image={recipe_kind.image} onDelete={onImageDelete} width="452" height="304" variant="medium" />
        <div style={{width: "100%"}}>
          <h1 className="recipe-title">
            <TextField model={recipe_kind} field="name" className="plain-input"/>
          </h1>
          <div style={{maxWidth: "600px", width: "100%", height: "400px"}}>
            <DescriptionTiptap content={JSON.parse(gon.recipe_kind.description_json)} model="recipe_kind" json_field="description_json" html_field="description_html" url={gon.recipe_kind.url}/>
          </div>
        </div>
      </div>
    </>)
  }
}

document.addEventListener('DOMContentLoaded', () => {

  const modHandler = new ModificationsHandler()
  window.registerEditor = (editor, model, json_field, html_field, url) => {
    modHandler.registerEditor(editor, model, json_field, html_field, url)
  }

  const root = document.getElementById('root')
  if (root) {ReactDOM.render(<RecipeKindEditor/>, root)}
})
