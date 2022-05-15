import React, { useState, useEffect, useRef } from 'react'

export const DeleteConfirmButton = ({id, onDeleteConfirm, message, children}) => {

  const [visible, setVisible] = React.useState(false);

  const showConfirm = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
    setVisible(true)
  }

  let button = null
  if (children) {
    button = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { onClick: showConfirm})
      }
      return child;
    })
  } else {
    button = <button type="button" className="plain-btn" onClick={showConfirm}>
               <img src="/icons/x-lg.svg"/>
             </button>
  }

  return (<>
    {button}
    {!visible ? '' :
      <span className="position-limbo">
        <span style={{transform: "translate(-50%, -30%)", zIndex: 10, padding: "0.5em", backgroundColor: '#fff', border: '1px solid black', borderRadius: '4px'}}>
          <div className="d-flex">
            <button type="button" className="btn btn-primary" style={{marginLeft: "10px"}} onClick={(e) => {onDeleteConfirm(e); setVisible(false)}}>Supprimer</button>
            <button type="button" className="plain-btn" onClick={(evt) => setVisible(false)} style={{paddingBottom: "1em", paddingLeft: "1.5em"}}>
              <img src="/icons/x-lg.svg"/>
            </button>
          </div>
        </span>
      </span>
    }
  </>)
}
