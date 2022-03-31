import React, { useState, useEffect, useRef } from 'react'
import Modal from 'react-bootstrap/Modal'

import {mapModels} from '../lib'

import {ajax} from '../utils'

//import {asyncUpdateModel, TextField, FileField, RadioField} from '../form'

export const AddExistingRecipe = ({recipes, btnRef, createBookRecipe}) => {
  const [showModal, setShowModal] = useState(false)
 
  useEffect(() => {
    btnRef.current.addEventListener('click', () => setShowModal(true))
    // TODO: Remove event listener in destructor
  }, []) 

  return (<>
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Dialog>
        <Modal.Body>
          <button style={{float: "right"}} type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
          <h5 className="modal-title">Ajouter une recette</h5>
          <ul>
            {mapModels(recipes, (recipe) => <li><button type="button" className="plain-btn" onClick={() => createBookRecipe(recipe)}>{recipe.name}</button></li>)}
          </ul>
        </Modal.Body>
      </Modal.Dialog>
    </Modal>
  </>)
}
