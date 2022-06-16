import React, { useState, useEffect } from 'react';
import { omit, join, bindSetter } from "./utils"

import {recipe_recipe_ingredient_path, food_path, recipe_ingredient_section_path, recipe_path, recipe_recipe_note_path, image_path } from './routes'

export const useUpdatableState = (name, initial) => {
  const [state, setState] = useState(initial)
  bindSetter(state, (updated) => {
    gon[name] = {...updated} // Keep gon updated to the latest state
    setState(updated)
  })
  return state
}
export const getStateProperties = (state) => {
  return omit(state, 'update')
}

export function urlFor(model) {
  switch(model.class_name) {
    case 'recipe': return recipe_path(model); break;
    case 'food': return food_path(model); break;
    case 'image': return image_path(model); break;
    case 'recipe_ingredient': return recipe_recipe_ingredient_path({id: model.recipe_id}, model); break;
    case 'ingredient_section': return recipe_ingredient_section_path({id: model.recipe_id}, model);break;
    case 'recipe_note': return recipe_recipe_note_path({id: model.recipe_id}, model); break;
    //case '': break;
    default: throw "Cannote find url for model " + model.class_name
  }
}

export const LinkToPage = ({page, className, children, active, ...props}) => {
  const switchPage = (evt, page) => {
    evt.preventDefault()
    page.update(getStateProperties(page))
  }
  const href = '?'+new URLSearchParams(getStateProperties(page)).toString()

  return <a className={join(className, active ? 'active' : null)} href={href} onClick={(e) => switchPage(e, page)} {...props}>{children}</a>
}


export const mapModels = (list, func) => {
  return list.map((item,i) => <span key={item.id}>{func(item,i)}</span>)
}

export const Show = ({cond, children}) => {
  return cond ? children : ''
}

export const useCacheOrFetchHTML = (url, args={}) => {
  const {waitFor, cache} = args
  const [data, setData] = useState(window[`fetched_${url}`]);

  useEffect(() => {
    if (!window[`fetching_${url}`] && !!waitFor) {
      console.log('FETCHING',url)
      fetch(url)
        .then(result => result.text())
        .then(content => {
          window[`fetched_${url}`] = content
          setData(content)
        });
      window[`fetching_${url}`] = true
    }
  }, [url, waitFor]);

  return data;
};

// FIXME: Badly implemented I believe...
export const useCacheOrFetch = (url, args={}) => {
  const {waitFor, cache} = args
  const [data, setData] = useState(window[`fetched_${url}`]);

  useEffect(() => {
    if (!window[`fetching_${url}`] && waitFor != false) {
      async function fetchData() {
        console.log(`Fetching data at ${url}`)
        const response = await fetch(url);
        const json = await response.json();
        window[`fetched_${url}`] = json
        setData(json);
      }
      window[`fetching_${url}`] = true
      fetchData();
    }
  }, [url, waitFor]);

  return data;
};

export const useWindowWidth = (args={}) => {

  const [winWidth, setWinWidth] = useState(window.innerWidth)
  useEffect(() => {
    const f = () => setWinWidth(window.innerWidth)
    window.addEventListener('resize', f)
    return () => {
      window.removeEventListener('resize', f)
    }
  }, [])

  return winWidth
};

export const useFetch = (url, args={}) => {
  const {waitFor} = args
  const [data, setData] = useState(null);

  useEffect(() => {
    if (waitFor != false) {
      async function fetchData() {
        console.log(`Fetching data at ${url}`)
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
      }
      fetchData();
    }
  }, [url, waitFor]);

  return data;
};

export function combineOrderedListWithHeaders(orderedList, headers, mapHeaderAttr) {
  let items = []
  for (let i=0; i < orderedList.length; i++) {
    headers.forEach((header, j) => {
      if (mapHeaderAttr(header) == i+1) {
        items.push(header)
      }
    })
    items.push(orderedList[i])
  }
  return items;
}

//export function getRecipeImage(recipe) {
//  return recipe.use_personalised_image ? recipe.recipe_image : recipe.recipe_kind_image
//}

const Lib = {}
Lib.combineOrderedListWithHeaders = combineOrderedListWithHeaders
export { Lib }
