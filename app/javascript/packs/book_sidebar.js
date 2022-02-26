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
  let filtered = {}
  if (data) {
    filtered = data.book_sections.reduce(function(result, book_section) {
      result[book_section.id] = data.recipes_by_section[book_section.id].filter(r => (
        r.recipe.name && ~normalizeSearchText(r.recipe.name).indexOf(term)
      ))
      return result
    }, {})
  }

  let select = (pos) => {
    setSelected(pos)
    // TODO: Change the value of the input field, but not the search
  }

  let onKeyDown = ({key}) => {
    //let countRecipes = () => (Object.values(filtered).reduce((total, a) => total+a.length), 0)
    let countRecipes = () => (Object.values(filtered).map(a => a.length).reduce((total, n)=>total+n))
    console.log('count', countRecipes())
    console.log('filtered', Object.values(filtered))
    if (key == "ArrowDown") {select(selected >= countRecipes()-1 ? -1 : selected+1)}
    if (key == "ArrowUp") {select(selected < 0 ? countRecipes()-1 : selected-1)}
    if (key == "Enter") {window.location.href = Object.values(filtered).flat()[selected].url}
          
  }
  console.log('selected', selected)

  let current = -1 // current recipe, compared to selected
  return (<>
    <div id="search-book" ref={collapseElem} className="collapse collapse-horizontal" style={{border: "1px solid black", padding: "0.5em", height: "100%"}}>
      <div style={{width: "300px", height: "100%"}}>
        <input id="book-filter" type="search" placeholder="Filtrer..." onChange={(e) => setSearch(e.target.value)} autoComplete="off" style={{width: "100%"}} onKeyDown={onKeyDown}/>
        {!data ? '' : (() => {
          return data.book_sections.map(book_section => {

            let book_recipes = filtered[book_section.id]
            if (isBlank(book_recipes)) {return ''}

            return (
              <div key={book_section.id}>
                <h3>{book_section.name}</h3>
                {book_recipes.map(book_recipe => {
                  current += 1
                  return <a className={current == selected ? "selected" : undefined} key={book_recipe.id} href={book_recipe.url}>{book_recipe.recipe.name}</a>
                })}
              </div>
            )
          })
        })()}
      </div>
    </div>
  </>)
}

document.addEventListener('DOMContentLoaded', () => {

  const root = document.getElementById('book-sidebar')
  if (root) {ReactDOM.render(<BookSidebar/>, root)}
})
