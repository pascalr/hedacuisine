import React, { useState, useEffect, useRef } from 'react'
import Modal from 'react-bootstrap/Modal'

//import {asyncUpdateModel, TextField, FileField, RadioField} from '../form'

export const PublicImageField = ({model, field, defaultSrc}) => {
  const [src, setSrc] = useState(model[field])
  const [showModal, setShowModal] = useState(false)

  return (<>
    <PublicImageModal show={showModal} setShowModal={setShowModal} />
    <div className="over-container" style={{cursor: "pointer", border: "1px dashed black"}} onClick={() => setShowModal(true)}>
      <img src={`/img/${src ? src : defaultSrc}`} />
      <div className="bottom-right" style={{color: 'white', fontSize: '2em'}}>
        <img src="/icons/pencil-circle.svg" style={{width: "5rem", padding: "0.5rem"}}/>
      </div>
    </div>
  </>)
}

const PublicImageModal = ({show, setShowModal}) => {

  console.log('show', show)

  return (<>
    <Modal show={show} onHide={() => setShowModal(false)}>
      <Modal.Dialog>
        <Modal.Body>
          <button style={{float: "right"}} type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
          <h5 className="modal-title">Image</h5>
        </Modal.Body>
      </Modal.Dialog>
    </Modal>
  </>)
}
