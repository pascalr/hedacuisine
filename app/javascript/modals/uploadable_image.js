import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import {asyncUpdateModel, TextField, FileField, RadioField} from 'form'

export const UploadableImage = ({onDelete, image, width, height, variant}) => {
  let path = image ? image.variants[variant] : ''
  // add imagePlaceholder??? width??? height???
  const [showModal, setShowModal] = useState(false)
  return (<>
    <div className="over-container">
      <ImageModal show={showModal} handleClose={() => setShowModal(false)} {...{image, onDelete, width, height, variant}} />
      <div style={{cursor: "pointer"}} onClick={() => setShowModal(true)}>
        <img style={{maxWidth: "100vh", height: "auto"}} src={path} {...{width, height}} />
        <div className="bottom-right" style={{color: 'white', fontSize: '2em'}}>
          <img src="/icons/pencil-circle.svg" style={{width: "5rem", padding: "0.5rem"}}/>
        </div>
      </div>
    </div> 
  </>)
}

const ImageModal = ({onDelete, image, show, handleClose, variant, width, height}) => {
  let path = image ? image.variants[variant] : ''

  return (<>
    <Modal show={show} onHide={handleClose}>
      <Modal.Dialog>
        <Modal.Body>
          <button style={{float: "right"}} type="button" className="btn-close" onClick={handleClose}></button>
          <h5 className="modal-title">Aperçu</h5>
          <div>
            <div style={{width: "fit-content"}}>
              <img style={{maxWidth: "100vh", height: "auto"}} src={path} width={width} height={height} />
            </div>
          </div>
          <hr/>
          <div style={{paddingLeft: "2em"}}>
            <div style={{height: "0.5em"}}/>
            <FileField model={image} field="original" onRemove={onDelete} maxSizeBytes={2*1000*1000} />
            <div style={{height: "0.5em"}}/>
            <RadioField model={image} field="is_user_author" value={true} label="Je suis l'auteur de cette image" />
            <div style={{height: "0.5em"}}/>
            <RadioField model={image} field="is_user_author" value={false} label="L'image est publique sous une license qui permet son usage" />
            <div style={{height: "0.5em"}}/>
            <div className={image.is_user_author ? 'disabled' : undefined} style={{paddingLeft: "2em"}}>
              <label htmlFor="author">Author</label>
              <TextField model={image} field="author" id="author"/>
              <div style={{height: "0.5em"}}/>
              <label htmlFor="source">Source</label>
              <TextField model={image} field="source" id="author"/>
            </div>
            <br/>
          </div>
        </Modal.Body>
      </Modal.Dialog>
    </Modal>
  </>)
}
