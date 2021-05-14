require("jquery")
require("easy-autocomplete")

document.addEventListener("DOMContentLoaded", function(event) { 
  //var options = {
  //  data: ["John", "Paul", "George", "Ringo"]
  //};
  //var searchField = document.getElementById("autocomplete-search")
  //$('*[data-behavior="autocomplete"]').easyAutocomplete({data: searchField.dataset.values});

  //data: [
  //  {"text": "Home", "website-link": "http://easyautocomplete.com/"},
  //  {"text": "Guide", "website-link": "http://easyautocomplete.com/guide"},
  //  {"text": "Themes", "website-link": "http://easyautocomplete.com/themes"},
  //  {"text": "Examples", "website-link": "http://easyautocomplete.com/examples"},
  //  {"text": "Download", "website-link": "http://easyautocomplete.com/download"},
  //  {"text": "Github", "website-link": "https://github.com/pawelczak/EasyAutocomplete"}
  //],

  var options = {
    getValue: "text",
    template: {
      type: "links",
      fields: {
        link: "link"
      }
    },
    list: {
      maxNumberOfElements: 30,
      match: {
        enabled: true
      }
    }
  };

  var locale = $("#locale").data("full")
  var searchField;

  /*searchField = $("#autocomplete-search-tags")
  options.data = []
  searchField.data("values").forEach((v) => {
    options.data.push({"text": v[1], "link": "tags/"+v[0]})
    //options.data.push({"text": v, "link": "/"+locale+"/tags/"+v})
  })
  searchField.easyAutocomplete(options);*/

  var included = {}

  searchField = $("#autocomplete-search-all")
  options.data = []
  searchField.data("items").forEach((v) => {
    options.data.push({"text": v[1] + " (catégorie)", "link": "/"+locale+"/items/"+v[0]+"_"+v[1]})
    included[v[1]] = true
  })
  searchField.data("ingredients").forEach((v) => {
    if (included[v[1]]) {
      options.data.push({"text": v[1] + " (ingrédient)", "link": "/"+locale+"/ingredients/"+v[0]+"_"+v[1]})
    } else {
      options.data.push({"text": v[1], "link": "/"+locale+"/ingredients/"+v[0]+"_"+v[1]})
    }
  })
  searchField.data("recipes").forEach((v) => {
    if (!included[v[1]]) {
      options.data.push({"text": v[1], "link": "/"+locale+"/recipes/"+v[0]+"_"+v[1]})
    }
  })
  searchField.easyAutocomplete(options);
});
