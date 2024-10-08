import {normalizeSearchText} from './utils'

import $ from 'jquery'
import 'js-autocomplete/auto-complete.css';
import autocomplete from 'js-autocomplete/auto-complete';

document.addEventListener("DOMContentLoaded", function(event) { 

  var elements = document.querySelectorAll('[data-autocomplete-url]');
  for (const elem of elements) {

    elem.addEventListener('focus', (evt) => {
      if (!elem.dataset.loaded) {
        $.get(elem.dataset.autocompleteUrl, function(choices) {
          new autocomplete({
            selector: elem,
            minChars: 3,
            menuClass: "top-search-suggestions",
            source: function(term, suggest){
              let tokens = normalizeSearchText(term).split(' ')
              const matches = [];
              const tokenMatch = (token, item) => {
                if (item.label && ~normalizeSearchText(item.label).indexOf(token)) {
                  return true
                } else if (item.author && ~normalizeSearchText(item.author).indexOf(token)) {
                  return true
                }
                return false
              }
              for (const choiceId in choices) {
                let item = choices[choiceId]
                if (tokens.every(token => tokenMatch(token, item))) {matches.push(choiceId)}
              }
              suggest(matches);
            },
            renderItem: function (choiceId, search){
              let item = choices[choiceId]
              search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
              var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
              if (item.author) {
                let src = item.image ? item.image : '/books/default01_thumb.jpg'
                return '<a class="autocomplete-suggestion book_search_thumb" data-val="'+item.label+'" href="'+item.url+'"><img src="'+src+'"></img><div><b>' + item.label + '</b><div>de '+item.author+'</div></div></a>';
              } else if (item.recipe_count) {
                let src = item.image ? item.image : '/default_recipe_01_thumb.png'
                return '<a class="autocomplete-suggestion" data-val="'+item.label+'" href="'+item.url+'"><img src="'+src+'"></img>' + item.label.replace(re, "<b>$1</b>") + ' ' + item.recipe_count + '</a>';
              } else {
                let src = item.image ? item.image : '/default_recipe_01_thumb.png'
                return '<a class="autocomplete-suggestion" data-val="'+item.label+'" href="'+item.url+'"><img src="'+src+'"></img>' + item.label.replace(re, "<b>$1</b>") + '</a>';
              }
            },
            onSelect: function(e, term, item){
              window.location.href = item.href
            }
          })
        })
        elem.dataset.loaded = true
      }
    })
  }
});
