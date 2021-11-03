document.addEventListener("DOMContentLoaded", function(event) { 
  

  var elements = document.querySelectorAll('[data-autocomplete-url]');
  for (const elem of elements) {

    $.get(elem.dataset.autocompleteUrl, function(choices) {

      new autocomplete({
        selector: elem,
        minChars: 1,
        source: function(term, suggest){
          console.log(this)
          term = term.toLowerCase();
          const matches = [];
          for (const choice in choices)
            if (~choice.toLowerCase().indexOf(term)) matches.push(choice);
          suggest(matches);
        },
        renderItem: function (item, search){
          search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
          return '<div class="autocomplete-suggestion" data-val="' + item + '"><img src="'+choices[item].image+'"></img>' + item.replace(re, "<b>$1</b>") + '</div>';
        },
        onSelect: function(e, term, item){
          window.location.href = choices[term].url
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