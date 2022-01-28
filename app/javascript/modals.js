import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import { getRecipeImage } from "lib"
import {RadioField} from 'form'

export const EditRecipeImageModal = ({recipe, show, handleClose}) => {

  const image = getRecipeImage(recipe)
  const imagePath = image.path || "/default_recipe_01.png"

  return (<>
    <Modal show={show} onHide={handleClose}>
      <Modal.Dialog>
        <Modal.Body>
          <button style={{float: "right"}} type="button" className="btn-close" onClick={handleClose}></button>
          <h5 className="modal-title">Aperçu</h5>
          <div>
            <div style={{width: "fit-content"}}>
              <img style={{maxWidth: "100vh", height: "auto"}} src={imagePath} width="255" height="171"/>
            </div>
          </div>
          <hr/>
          <RadioField model={recipe} field="use_personalised_image" value={false} label="Utiliser l'image de la catégorie de cette recette"/>
          <div style={{paddingLeft: "2em"}}>
            <br/>
          </div>
          <RadioField model={recipe} field="use_personalised_image" value={true} label="Utiliser une image personnalisée"/>
          <div className={recipe.use_personalised_image ? undefined : 'disabled'} style={{paddingLeft: "2em"}}>
            <div style={{height: "0.5em"}}/>
            <input type="file" name="image[original]" id="image_original"/>
            <div style={{height: "0.5em"}}/>
            <RadioField model={recipe.recipe_image} field="is_user_author" value={true} id="is_user_author_true"/>
            <label value="true" htmlFor="image_is_user_author_true">Je suis l'auteur de cette image</label>
            <div style={{height: "0.5em"}}/>
            <RadioField model={recipe.recipe_image} field="is_user_author" value={false} id="is_user_author_false"/>
            <label value="false" htmlFor="is_user_author_false">L'image est publique sous une license qui permet son usage</label>
            <div style={{height: "0.5em"}}/>
            <div style={{paddingLeft: "2em"}}>
              <label htmlFor="author">Author</label>
              <input type="text" name="author" id="author"/>
              <div style={{height: "0.5em"}}/>
              <label htmlFor="source">Source</label>
              <input type="text" name="source" id="source"/>
            </div>
            <br/>
          </div>
        </Modal.Body>
      </Modal.Dialog>
    </Modal>
  </>)
}
