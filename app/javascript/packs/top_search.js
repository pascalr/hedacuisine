require("jquery")
require("easy-autocomplete")

document.addEventListener("DOMContentLoaded", function(event) { 

  var options = {
    getValue: "text",
    template: {
      type: "links",
      fields: {
        link: "link"
      }
    },
    data: [],
    list: {
      maxNumberOfElements: 12,
      match: {
        enabled: true
      }
    }
  };

  //var locale = $("#locale").data("full")

  var elem = $("#top-search")
  elem.data("menus").forEach((v) => {
    options.data.push({"text": v[1] + " (menu)", "link": "/menus/"+v[0]+"_"+v[1]})
    //options.data.push({"text": v[1], "link": "/"+locale+"/recipes/"+v[0]+"_"+v[1]})
  })
  elem.data("foods").forEach((v) => {
    options.data.push({"text": v[1] + " (ingredient)", "link": "/foods/"+v[0]+"_"+v[1]})
    //options.data.push({"text": v[1], "link": "/"+locale+"/recipes/"+v[0]+"_"+v[1]})
  })
  elem.data("recipes").forEach((v) => {
    options.data.push({"text": v[1], "link": "/recipes/"+v[0]+"_"+v[1]})
    //options.data.push({"text": v[1], "link": "/"+locale+"/recipes/"+v[0]+"_"+v[1]})
  })
  elem.easyAutocomplete(options);

});

