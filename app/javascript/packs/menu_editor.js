require("jquery")
require("easy-autocomplete")

document.addEventListener("DOMContentLoaded", function(event) { 

  var options = {
    //getValue: "text",
    //template: {
    //  type: "links",
    //  fields: {
    //    link: "link"
    //  }
    //},
    data: [],
    list: {
      maxNumberOfElements: 12,
      match: {
        enabled: true
      }
    }
  };

  var locale = $("#locale").data("full")
  var searchField;

  var included = {}

  var data = $("#autocomplete-data")
  data.data("recipes").forEach((v) => {
    //console.log(v[1])
    options.data.push(v[1])
    //options.data.push({"text": v[1], "link": "/"+locale+"/recipes/"+v[0]+"_"+v[1]})
  })
  // IMPORTANT: Somehow, this must be called before hidden the fields.
  // Also somehow the following line only works for the first in the page.
  //$(".autocomplete-search-recipe").easyAutocomplete(options);
  $('.autocomplete-search-recipe').each(function(i, obj) {
    $('#'+obj.id).easyAutocomplete(options);
  });

  var links = document.getElementsByClassName('toggle_link')
  for (var i = 0; i < links.length; i++) {
    var link = links.item(i)
    document.getElementById(link.dataset.toggle_id).hidden = true;
    link.addEventListener("click", function(e) {
      var elem = document.getElementById(e.target.dataset.toggle_id);
      elem.hidden = !elem.hidden
    })
  }

});

