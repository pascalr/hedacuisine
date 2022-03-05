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

const PasteIngredientsModal = ({show, handleClose, handleSubmit}) => {
  const inputRef = useRef(null);
  return (<>
    <Modal show={show} onHide={handleClose}>
      <Modal.Dialog>
        <Modal.Body>
          <button style={{float: "right"}} type="button" className="btn-close" onClick={handleClose}></button>
          <h5 className="modal-title">Copier/coller de nouveaux ingrédients</h5>
          <textarea name='pasted-ingredients' placeholder="Par exemple...&#10;1 1/2 t farine tout usage&#10;250 mL d'eau&#10;4 oeufs&#10;" cols={45} rows={15} ref={inputRef} />
          <button type="button" className="btn btn-outline-primary" onClick={() => {
              handleSubmit(inputRef.current.value)
              handleClose()
            }}>
            Analyzer et ajouter
          </button>
          <br/><br/>
          <h5>Note</h5>
          <p>Entrer un ingrédient par ligne. Les noms de sections d'ingrédients ne sont pas supportés dans ce mode. Il faut les ajouter par après.</p>
        </Modal.Body>
      </Modal.Dialog>
    </Modal>
  </>)
}
