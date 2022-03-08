import React, { useState, useEffect, useRef } from 'react'
import Modal from 'react-bootstrap/Modal'

import {asyncUpdateModel, TextField, FileField, RadioField} from 'form'

export const PasteIngredientsButton = (props) => {
  const [showModal, setShowModal] = useState(false)
  return (<>
    <button type="button" className="plain-btn" onClick={() => setShowModal(true)}>
      <img src="/icons/clipboard-data.svg" style={{width: "2.5rem", padding: "0.5rem"}}/>
    </button>
    <PasteIngredientsModal show={showModal} handleClose={() => setShowModal(false)} {...props} />
  </>)
}

const PasteIngredientsModal = ({ingredients, show, handleClose, handleSubmit}) => {
  const inputRef = useRef(null);
  let ingText = ''
  ingredients.forEach(ing => {
    if (ing.raw) {ingText += ing.raw} // raw quantity
    if (ing.raw && ing.raw_food) {ingText += '; '}
    if (ing.raw_food) {ingText += ing.raw_food}
    ingText += '\n'
  })
  return (<>
    <Modal show={show} onHide={handleClose}>
      <Modal.Dialog>
        <Modal.Body>
          <button style={{float: "right"}} type="button" className="btn-close" onClick={handleClose}></button>
          <h5 className="modal-title">Modifier les ingrédients</h5>
          <textarea name='pasted-ingredients' defaultValue={ingText} placeholder="Par exemple...&#10;1 1/2 t farine tout usage&#10;250 mL d'eau&#10;4 oeufs&#10;" cols={45} rows={15} ref={inputRef} />
          <button type="button" className="btn btn-outline-primary" onClick={() => {
              handleSubmit(inputRef.current.value)
              handleClose()
            }}>
            Modifier 
          </button>
          <br/><br/>
          <h5>Notes</h5>
          <ol>
            <li>Entrer un ingrédient par ligne.</li>
            <li>Les noms de sections d'ingrédients ne sont pas encore supportés dans ce mode. Il faut les ajouter par après.</li>
            <li>Il n'est pas obligatoire de séparer les quantités du nom des aliments pas un point-virgule, mais c'est recommandé si le programme n'arrive pas à faire la séparation automatiquement.</li>
          </ol>
        </Modal.Body>
      </Modal.Dialog>
    </Modal>
  </>)
}
