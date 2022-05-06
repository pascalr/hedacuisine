import React, { useState, useEffect, useRef } from 'react'
import Modal from 'react-bootstrap/Modal'

import {ajax} from '../utils'
import {mapModels} from '../lib'
import {update_tags_recipe_path} from '../routes'

//import {ajax} from '../utils'

//import {asyncUpdateModel, TextField, FileField, RadioField} from '../form'

export const EditUserRecipeModal = ({showModal, setShowModal, recipe, tags, suggestions}) => {

  let isTagChecked = (tag) => (!!suggestions.find(suggestion => suggestion.filter_id == tag.id && suggestion.recipe_id == recipe.id))
 
  let [tagsChecked, setTagsChecked] = useState([])

  useEffect(() => {
    if (tags && suggestions && recipe) {
      setTagsChecked(tags.map(tag => isTagChecked(tag)))
    }
  }, [suggestions, tags, recipe])

  let setTagChecked = (i, checked) => {
    let s = [...tagsChecked]
    s[i] = checked
    setTagsChecked(s)
  }

  const updateSuggestions = () => {
    let ts = tags.filter((t,i) => tagsChecked[i]).map(t => t.id)
    ajax({url: update_tags_recipe_path(recipe), type: 'PATCH', data: {tags: ts}, success: ({created, destroyed}) => {
      let ss = [...created, ...suggestions]
      ss = ss.filter(s => !destroyed.includes(s.id))
      suggestions.update(ss)
      setShowModal(false)
    }, error: () => {
    }})
  }
 
  if (recipe == null) {return ''}
  return (<>
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Dialog>
        <Modal.Body>
          <button style={{float: "right"}} type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
          <h5 className="modal-title">{recipe.name}</h5>
          <br/>
          <h6><b>Tags</b></h6>
          <ul style={{listStyleType: 'none', padding: '0', margin: '0'}}>
            {mapModels(tags, (tag, i) => {
              return <li><input type="checkbox" checked={tagsChecked[i] || false} onChange={(evt) => setTagChecked(i, evt.currentTarget.checked)}/> {tag.name}</li>
            })}
          </ul>
          <br/>
          <button type="button" className="btn btn-primary" onClick={() => updateSuggestions()}>Update</button>
        </Modal.Body>
      </Modal.Dialog>
    </Modal>
  </>)
}
