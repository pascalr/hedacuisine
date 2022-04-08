import React, { useState, useEffect, useRef } from 'react'
import Modal from 'react-bootstrap/Modal'

import { updateRecordField } from "../form"
import { useFetch } from "../lib"
import { public_images_path } from '../routes'

//import {asyncUpdateModel, TextField, FileField, RadioField} from '../form'

export const PublicImageField = ({model, field, defaultSrc, url, getter, setter}) => {
  const [showModal, setShowModal] = useState(false)

  return (<>
    <PublicImageModal show={showModal} setShowModal={setShowModal} model={model} field={field} url={url} getter={getter} setter={setter} />
    <div className="over-container" style={{cursor: "pointer", border: "1px dashed black"}} onClick={() => setShowModal(true)}>
      <img src={`/img/${model[field] || defaultSrc}`} width="150" height="150" />
      <div className="bottom-right" style={{color: 'white', fontSize: '2em'}}>
        <img src="/icons/pencil-circle.svg" style={{width: "5rem", padding: "0.5rem"}}/>
      </div>
    </div>
  </>)
}

const PublicImageModal = ({model, field, show, setShowModal, url, getter, setter}) => {

  const publicImages = useFetch(public_images_path()) // FIXME: useFetch should cache the data...

  const updateSrc = (image) => {
    updateRecordField(model, field, image, url, getter, setter)
    setShowModal(false)
 }

  const images = !publicImages ? [] : publicImages.map(image => <img key={image} className="clickable" onClick={() => updateSrc(image)} src={`/img/${image}`} width="150" height="150" style={{margin: "10px"}}/>)

  return (<>
    <Modal show={show} onHide={() => setShowModal(false)}>
      <Modal.Dialog>
        <Modal.Body>
          <button style={{float: "right"}} type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
          <h5 className="modal-title">Sélectionner une image</h5>
          {images}
        </Modal.Body>
      </Modal.Dialog>
    </Modal>
  </>)
}
