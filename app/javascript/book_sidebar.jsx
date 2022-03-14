import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { isBlank, normalizeSearchText } from "./utils"
import { useFetch } from "./lib"

import Hammer from "react-hammerjs"

const BookSidebar = () => {
  
  const isWideScreen = window.innerWidth >= 992
  const inputField = useRef(null);
  const [init, setInit] = useState(isWideScreen)
  //const [data, setData] = useState(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(-1)
  const [visible, setVisible] = useState(isWideScreen)
  const data = useFetch(window.book_sidebar.dataset.url, {waitFor: init})

  const doInit = () => {
    //inputField.current.focus()
    if (!init) {setInit(true)}
  }
  
  useEffect(() => {
    let elems = document.querySelectorAll('[data-book-search-toggle]')
    for (let i = 0; i < elems.length; i++) {
      let elem = elems[i]
      elem.handleToggle = () => {setVisible(true); doInit()} // FIXME: This does not work: setVisible(!visible)
      elem.addEventListener("click", elem.handleToggle)
    }
    return () => {
      let elems = document.querySelectorAll('[data-book-search-toggle]')
      for (let i = 0; i < elems.length; i++) {
        elem.removeEventListener("click", elem.handleToggle)
      }
    }
  }, []);
 
  let term = normalizeSearchText(search)
  let filtered = []
  if (data) {
    // 0 means no section
    filtered = filtered.concat((data.recipes_by_section[0]||[]).filter(r => (
      r.recipe.name && ~normalizeSearchText(r.recipe.name).indexOf(term)
    )))
    data.book_sections.forEach((book_section) => {
      filtered = filtered.concat((data.recipes_by_section[book_section.id]||[]).filter(r => (
        r.recipe.name && ~normalizeSearchText(r.recipe.name).indexOf(term)
      )))
    })
  }

  let select = (pos) => {
    setSelected(pos)
    // TODO: Change the value of the input field, but not the search
  }

  let onKeyDown = ({key}) => {
    if (key == "ArrowDown") {select(selected >= filtered.length-1 ? -1 : selected+1)}
    if (key == "ArrowUp") {select(selected < 0 ? filtered.length-1 : selected-1)}
    if (key == "Enter") {window.location.href = filtered[selected].url+"#main"}
  }

  let handleSwipe = ({direction}) => {
    if (direction == 2) {
      setVisible(false)
    }
  }

  let sectionPrinted = {}
  return (<>
    <div className={visible ? "visible" : undefined} id="search-book">
      <Hammer onSwipe={handleSwipe}>
        <div>
          <button type="button" className="plain-btn" onClick={() => setVisible(false)} style={{float: "right"}}>
            <img src="/icons/x-lg.svg"/>
          </button>
          <h2 style={{fontSize: "1.5em"}}>{data ? data.book_name : ''}</h2>
          <input id="book-filter" type="search" placeholder="Filtrer..." onChange={(e) => setSearch(e.target.value)} autoComplete="off" style={{width: "100%"}} onKeyDown={onKeyDown}/>
          {filtered.map((book_recipe, current) => {
            let printSection = (section_id) => {
              if (sectionPrinted[section_id]) {return ''}
              sectionPrinted[section_id] = true
              let section = data.book_sections.find(b => b.id == section_id)
              return section ? <h3>{section.name}</h3> : ''
            }
            return (
              <div key={book_recipe.id}>
                {printSection(book_recipe.book_section_id)}
                <a className={current == selected ? "selected" : undefined} href={book_recipe.url+"#main"}>{book_recipe.recipe.name}</a>
              </div>
            )
          })}
        </div>
      </Hammer>
    </div>
  </>)
}

document.addEventListener('DOMContentLoaded', () => {

  const root = document.getElementById('book-sidebar')
  window.book_sidebar = root
  if (root) {ReactDOM.render(<BookSidebar/>, root)}
})
