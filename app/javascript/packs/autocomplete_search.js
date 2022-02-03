import {normalizeSearchText} from '../utils'

document.addEventListener("DOMContentLoaded", function(event) { 

  var elements = document.querySelectorAll('[data-autocomplete-url]');
  for (const elem of elements) {

    $.get(elem.dataset.autocompleteUrl, function(choices) {

      new autocomplete({
        selector: elem,
        minChars: 1,
        source: function(term, suggest){
          term = normalizeSearchText(term)
          const matches = [];
          for (const choiceId in choices) {
            let item = choices[choiceId]
            if (item.label && ~normalizeSearchText(item.label).indexOf(term)) {
              matches.push(choiceId);
            } else if (item.author && ~normalizeSearchText(item.author).indexOf(term)) {
              matches.push(choiceId);
            }
          }
          suggest(matches);
        },
        renderItem: function (choiceId, search){
          let item = choices[choiceId]
          search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
          // FIXME: Why data-val???
          if (item.author) {
            return '<a class="autocomplete-suggestion book_search_thumb" data-id="' + choiceId + '" href="'+item.url+'"><img src="'+item.image+'"></img><div><b>' + item.label + '</b><div>de '+item.author+'</div></div></a>';
          } else {
            return '<a class="autocomplete-suggestion" data-id="' + choiceId + '" href="'+item.url+'"><img src="'+item.image+'"></img>' + item.label.replace(re, "<b>$1</b>") + '</a>';
          }
        },
        onSelect: function(e, term, item){
          window.location.href = choices[item.dataset.id].url
        }
      })

    });
  }

  const topSearch = $('#top-search')
  const input = topSearch.children("input")
  const image = topSearch.children("img")
  input.on('focus', (evt) => {
  });
  input.on('focusout', (evt) => {
  });

});
