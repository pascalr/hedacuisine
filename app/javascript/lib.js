import { useEffect } from 'react';

export const useFetch = (url) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(url);
      const json = await response.json();
      setData(json);
    }
    fetchData();
  }, [url]);

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
