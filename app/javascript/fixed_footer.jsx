import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

const FIXED_FOOTER_SIZE = "2"

const FixedFooter = () => {
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState('')
  const [timestampS, setTimestamp] = useState(null)
  const [timeS, setTimeS] = useState(new Date().getTime() / 1000)

  window.display = function(msg, isError=false) {
    console.log('display', msg)
    let t = new Date().getTime() / 1000
    setMessage(msg)
    setTimestamp(t)
    setTimeS(t)
    setIsError(isError)
  }
  
  window.displayError = function(msg) {
    console.log('displayError', msg)
    window.display(msg, true)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeS(new Date().getTime() / 1000)
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timestampS || !message) {return ''}

  function timeAgoInWords(s) {
    if (s < 60) {return s < 2 ? `${s} seconde` : `${s} secondes`}
    if (s < 3600) {m = Math.floor(s/60); return m < 2 ? `${m} minute` : `${m} minutes`}
    if (s < 86400) {h = Math.floor(s/3600); return h < 2 ? `${h} heure` : `${h} heures`}
    d = Math.floor(s/86400); return d < 2 ? `${d} jour` : `${d} jours`
  }
  let s = Math.floor(timeS - timestampS)
  if (isError) {
    return <div style={{color: "red"}}>Erreur: {message} (il y a {timeAgoInWords(s)})</div>
  } else {
    return <div>{message} (il y a {timeAgoInWords(s)})</div>
  }
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
