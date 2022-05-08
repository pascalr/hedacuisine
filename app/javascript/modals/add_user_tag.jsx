import React, { useState, useEffect, useRef } from 'react'
import Modal from 'react-bootstrap/Modal'

import {ajax} from '../utils'
import {mapModels} from '../lib'
import {AutocompleteInput} from '../form'
import {user_tags_path} from '../routes'

//import {ajax} from '../utils'

//import {asyncUpdateModel, TextField, FileField, RadioField} from '../form'

export const AddUserTagModal = ({showModal, setShowModal, tags, userTags}) => {
  
  const hedaTags = tags.filter(f => !f.user_id)

  //let [tagsChecked, setTagsChecked] = useState([])

  //useEffect(() => {
  //  if (tags && suggestions && recipe) {
  //    setTagsChecked(tags.map(tag => isTagChecked(tag)))
  //  }
  //}, [suggestions, tags, recipe])

  //let setTagChecked = (i, checked) => {
  //  let s = [...tagsChecked]
  //  s[i] = checked
  //  setTagsChecked(s)
  //}

  //const updateSuggestions = () => {
  //  let ts = tags.filter((t,i) => tagsChecked[i]).map(t => t.id)
  //  ajax({url: update_tags_recipe_path(recipe), type: 'PATCH', data: {tags: ts}, success: ({created, destroyed}) => {
  //    let ss = [...created, ...suggestions]
  //    ss = ss.filter(s => !destroyed.includes(s.id))
  //    suggestions.update(ss)
  //    setShowModal(false)
  //  }, error: () => {
  //  }})
  //}
  
  const createUserTag = (e, term, item) => {
    if (item.dataset.id) {
      ajax({url: user_tags_path(), type: 'POST', data: {user_tag: {tag_id: item.dataset.id}}, success: (userTag) => {
        userTags.update([...userTags, userTag])
      }})
    }
  }
 
  //if (recipe == null) {return ''}
  return (<>
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Dialog>
        <Modal.Body>
          <button style={{float: "right"}} type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
          <h5 className="modal-title">Ajouter une étiquette</h5>
          <br/>
          <AutocompleteInput name="name" choices={hedaTags} onSelect={createUserTag} />
          <br/>
          <br/>
          <button type="button" className="btn btn-primary" onClick={() => {}}>Ajouter</button>
        </Modal.Body>
      </Modal.Dialog>
    </Modal>
  </>)
}
