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
        $('#autocomplete-food-id').val($('#autocomplete-food').getSelectedItemData()['id']);
		  }
    }
  };

  var data = $("#autocomplete-data")
  data.data("foods").forEach((v) => {
    options.data.push({id: v[0], n: v[1]})
  })

  console.log(options.data);
  $("#autocomplete-food").easyAutocomplete(options);

});

