import 'js-autocomplete/auto-complete.css';
import autocomplete from 'js-autocomplete';

document.addEventListener("DOMContentLoaded", function(event) { 
  const foods = JSON.parse(document.getElementById('autocomplete-data').dataset.foods)
  console.log(foods)
  var elements = document.querySelectorAll('[data-autocomplete]');
  for (const elem of elements) {
    new autocomplete({
      selector: elem,
      minChars: 1,
      source: function(term, suggest){
        term = term.toLowerCase();
        const choices = foods;
        const matches = [];
        for (let i = 0; i < choices.length; i++)
            if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
        suggest(matches);
      }
    })
  }
});

//  //var elements = document.querySelectorAll('[data-autocomplete-id]');

//const autocompleteSearch = function() {
//  const skills = JSON.parse(document.getElementById('search-data').dataset.skills)
//  const searchInput = document.getElementById('q');
//
//  if (skills && searchInput) {
//    new autocomplete({
//      selector: searchInput,
//      minChars: 1,
//      source: function(term, suggest){
//          term = term.toLowerCase();
//          const choices = skills;
//          const matches = [];
//          for (let i = 0; i < choices.length; i++)
//              if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
//          suggest(matches);
//      },
//    });
//  }
//};
//
//export { autocompleteSearch };

//require("jquery")
//require("easy-autocomplete")
//
//document.addEventListener("DOMContentLoaded", function(event) { 
//
//  var options = {
//    getValue: "n",
//    data: [],
//    list: {
//      maxNumberOfElements: 30,
//      match: {
//        enabled: true
//      }
//    }
//  };
//
//  var data = $("#autocomplete-data")
//  data.data("foods").forEach((v) => {
//    options.data.push({id: v[0], n: v[1]})
//  })
//
//  //var elements = document.querySelectorAll('[data-autocomplete-id]');
//  //for (const elem of elements) {
//  //  elem.easyAutocomplete(options);
//  //}
//  $("[data-autocomplete-id]").each(function() {
//
//    options.list.onChooseEvent = function(elem) {
//      var id = console.log($(this).data("autocomplete-id"))
//      console.log("id")
//      console.log($(this).attr('id'))
//      console.log($(this).getSelectedItemData()['id'])
//      console.log($('#'+$(this).attr('id')).getSelectedItemData()['id'])
//      $('#'+id).val($(this).getSelectedItemData()['id']);
//	  }.bind(this)
//    var dup = {...options}
//    dup.list = {...options.list}
//    dup.list.match = {...options.list.match}
//    $(this).easyAutocomplete(dup);
//  })
//  var elements = $("[data-autocomplete-id]").easyAutocomplete(options);
//
//});
