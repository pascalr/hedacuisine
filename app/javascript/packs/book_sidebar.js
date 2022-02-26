import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { isBlank, normalizeSearchText } from "../utils"

const BookSidebar = () => {
  
  const collapseElem = useRef(null);
  const inputField = useRef(null);
  const [init, setInit] = useState(false)
  const [data, setData] = useState(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(-1)
  
  useEffect(() => {
    if (init) {
      $.get(collapseElem.current.parentNode.dataset.url, function(data) {
        setData(data)
      })
    }
  }, [init]);

  const doInit = () => {
    //inputField.current.focus()
    if (!init) {setInit(true)}
  }
  
  useEffect(() => {
    collapseElem.current.addEventListener("shown.bs.collapse", doInit)
    return () => {
      collapseElem.current.removeEventListener("", doInit)
    }
  }, []);


  //  renderItem: function ({section, recipe}, search){
  //    search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  //    var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
  //    let r = ""
  //    if (section) {r += `<h3>${section.name}</h3>`}
  //    return r+'<a class="autocomplete-suggestion" data-val="'+recipe.recipe.name+'" href="'+recipe.url+'"><b>' + recipe.recipe.name + '</b></a>'
  //  },
  //  onSelect: function(e, term, item){
  //    window.location.href = item.href
  //  }
  //})
  //inputField.current.showEmptyAutocomplete()
 
  let term = normalizeSearchText(search)
  let filtered = []
  if (data) {
    data.book_sections.forEach((book_section) => {
      filtered = filtered.concat(data.recipes_by_section[book_section.id].filter(r => (
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
  console.log('filtered', filtered)
  console.log('selected', selected)

  let sectionPrinted = {}

  return (<>
    <div id="search-book" ref={collapseElem} className="collapse collapse-horizontal" style={{border: "1px solid black", padding: "0.5em", height: "100%"}}>
      <div style={{width: "300px", height: "100%"}}>
        <h2 style={{fontSize: "1.5em"}}>{data ? data.book_name : ''}</h2>
        <input id="book-filter" type="search" placeholder="Filtrer..." onChange={(e) => setSearch(e.target.value)} autoComplete="off" style={{width: "100%"}} onKeyDown={onKeyDown}/>
        {filtered.map((book_recipe, current) => {
          let printSection = (section_id) => {
            if (sectionPrinted[section_id]) {return ''}
            sectionPrinted[section_id] = true
            return <h3>{data.book_sections.find(b => b.id == section_id).name}</h3>
          }
          return (
            <div key={book_recipe.id}>
              {printSection(book_recipe.book_section_id)}
              <a className={current == selected ? "selected" : undefined} href={book_recipe.url+"#main"}>{book_recipe.recipe.name}</a>
            </div>
          )
        })}
      </div>
    </div>
  </>)
}

document.addEventListener('DOMContentLoaded', () => {

  const root = document.getElementById('book-sidebar')
  if (root) {ReactDOM.render(<BookSidebar/>, root)}
})
