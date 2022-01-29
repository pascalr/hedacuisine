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
            <RadioField model={image} field="is_user_author" value={true} label="Je suis l'auteur de cette image" />
            <div style={{height: "0.5em"}}/>
            <RadioField model={image} field="is_user_author" value={false} label="L'image est publique sous une license qui permet son usage" />
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
