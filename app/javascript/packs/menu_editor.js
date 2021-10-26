require("jquery")
require("easy-autocomplete")

document.addEventListener("DOMContentLoaded", function(event) { 

  var options = {
    getValue: "n",
    data: [],
    list: {
      maxNumberOfElements: 30,
      match: {
        enabled: true
      },
      onChooseEvent: function(evt) {
        // This is really ugly. But somehow easyautocomplete.js does not
        // tell which which element this event happened to.
        // There is an open pull request that solves this:
        // https://github.com/pawelczak/EasyAutocomplete/pull/250/files
        $('.autocomplete-search-recipe').each(function(i, obj) {
          var el = $('#'+obj.id);
          $('#'+obj.id+'-id').val(el.getSelectedItemData()['id']);
        });
		  }
    }
  };

  //var locale = $("#locale").data("full")
  var searchField;

  var included = {}

  var data = $("#autocomplete-data")
  data.data("recipes").forEach((v) => {
    options.data.push({id: v[0], n: v[1]})
  })

  // IMPORTANT: Somehow, this must be called before hidding the fields.
  // Also somehow the following line only works for the first in the page.
  //$(".autocomplete-search-recipe").easyAutocomplete(options);
  $('.autocomplete-search-recipe').each(function(i, obj) {
    $('#'+obj.id).easyAutocomplete(options);
  });

  // THIS MUST BE HERE. AFTER easyAutocomplete is called...
  var links = document.getElementsByClassName('toggle-link')
  for (var i = 0; i < links.length; i++) {
    var link = links.item(i)
    document.getElementById(link.dataset.toggle_id).hidden = true;
    link.addEventListener("click", function(e) {
      var elem = document.getElementById(e.target.dataset.toggle_id);
      elem.hidden = !elem.hidden
    })
  }

});

