document.addEventListener("DOMContentLoaded", function(event) { 
  var elements = document.querySelectorAll('[data-autocomplete]');
  for (const elem of elements) {
    new autocomplete({
      selector: elem,
      minChars: 1,
      source: function(term, suggest){
        term = term.toLowerCase();
        const choices = JSON.parse(document.getElementById(elem.dataset.autocomplete).dataset.values)
        const matches = [];
        for (let i = 0; i < choices.length; i++)
            if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
        suggest(matches);
      }
    })
  }
});
