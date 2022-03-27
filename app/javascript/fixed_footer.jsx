import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

const FIXED_FOOTER_SIZE = "2"

const FixedFooter = () => {
  return (
    <div>
      Testing1212
    </div>
  )
}

document.addEventListener('DOMContentLoaded', () => {
  
  let blank = document.createElement("div")
  blank.style = "height: "+FIXED_FOOTER_SIZE+"em;"
  //document.body.appendChild(blank)
  document.getElementsByTagName('footer')[0].appendChild(blank)
  
  let elem = document.createElement("div")
  elem.style = `background-color: white; padding-top: 0.2em; padding-left: 1em; border-top: 1px solid black; position: fixed; width: 100%; bottom: 0px; height: ${FIXED_FOOTER_SIZE}em; z-index: 9000`
  document.body.prepend(elem)
  ReactDOM.render(<FixedFooter/>, elem)
})
