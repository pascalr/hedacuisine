import React, { useState, useEffect } from 'react';

export const mapModels = (list, func) => {
  return list.map((item,i) => <span key={item.id}>{func(item,i)}</span>)
}

export const Show = ({cond, children}) => {
  return cond ? children : ''
}

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
