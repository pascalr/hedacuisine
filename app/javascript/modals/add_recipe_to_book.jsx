import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-bootstrap/Modal'

import {mapModels} from '../lib'

import {ajax} from '../utils'

import {book_recipes_book_path} from '../routes'

//import {asyncUpdateModel, TextField, FileField, RadioField} from '../form'

export const addRecipeToBook = (btnElem) => {
  if (!btnElem) {return}
  ReactDOM.render(<AddRecipeToBook btnRef={btnElem} />, document.body.appendChild(document.createElement("DIV")))  
}

const AddRecipeToBook = ({btnRef}) => {
  const [showModal, setShowModal] = useState(false)
 
  useEffect(() => {
    btnRef.addEventListener('click', () => setShowModal(true))
  }, []) 


  const createBookRecipe = (book) => {
    let data = new FormData()
    data.append("book_recipe[recipe_id]", gon.recipe_id)
    data.append("book_recipe[book_id]", book.id)
    ajax({url: book_recipes_book_path(book), type: 'POST', data: data, success: () => {
      setShowModal(false)
    }})
  }

  return (<>
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Dialog>
        <Modal.Body>
          <button style={{float: "right"}} type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
          <h5 className="modal-title">Sélectionner un livre</h5>
          <ul>
            {mapModels(gon.books, (book) => <li><button type="button" className="plain-btn" onClick={() => createBookRecipe(book)}>{book.name}</button></li>)}
          </ul>
        </Modal.Body>
      </Modal.Dialog>
    </Modal>
  </>)
}
