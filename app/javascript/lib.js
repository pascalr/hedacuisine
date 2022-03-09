import { useState, useEffect } from 'react';

export const useFetch = (url, {waitFor}) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (waitFor != false) {
      async function fetchData() {
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
