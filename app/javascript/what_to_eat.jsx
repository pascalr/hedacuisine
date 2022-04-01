import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

const ChooseOccasion = () => {
  // Pour recevoir des invités => (page suivantes, quelles restrictions => véganes)
  return (<>
    <h2 style={{textAlign: "center"}}>Pour quelle occasion cuisiner?</h2>
    <div id="occasions-btns" className="d-flex" style={{flexDirection: "column"}}>
      <button type="button" className="btn btn-primary">Se gâter</button>
      <button type="button" className="btn btn-primary">Repas pour toute la semaine</button>
      <button type="button" className="btn btn-primary">Repas pour emporter la journée</button>
      <button type="button" className="btn btn-primary">Pour passer un ingrédient</button>
      <button type="button" className="btn btn-primary">Pour recevoir des invités</button>
      <button type="button" className="btn btn-primary">Pour apporter à un potluck</button>
      <button type="button" className="btn btn-primary">Une recette rapide de semaine</button>
    </div>
  </>)
}

const WhatToEat = () => {

  const [currentPage, setCurrentPage] = useState(1)

  const pages = {
    1: <ChooseOccasion changePage={setCurrentPage} />
  }

  // Pour recevoir des invités => (page suivantes, quelles restrictions => véganes)
  return (<>
    {pages[currentPage]}
  </>)
}

document.addEventListener('DOMContentLoaded', () => {

  const root = document.getElementById('what-to-eat')
  if (root) {ReactDOM.render(<WhatToEat/>, root)}
})
