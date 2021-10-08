document.addEventListener("DOMContentLoaded", function(event) { 

  var elements = document.querySelectorAll('[data-autocomplete-links]');
  for (const elem of elements) {

    const dataElem = document.getElementById(elem.dataset.autocompleteLinks)
    if (!dataElem) {
      console.log("Error: Can't add autocomplete link. Data element is missing.")
    } else {
      const choices = JSON.parse(dataElem.dataset.values)
      new autocomplete({
        selector: elem,
        minChars: 1,
        source: function(term, suggest){
          console.log(this)
          term = term.toLowerCase();
          const matches = [];
          for (let i = 0; i < choices.length; i++)
              if (~choices[i].label.toLowerCase().indexOf(term)) matches.push(choices[i].label);
              //if (~choices[i].label.toLowerCase().indexOf(term)) matches.push("<a href='"+choices[i].url+"'>"+choices[i].label+"</a>");
          suggest(matches);
        },
        onSelect: function(e, term, item){
          var r = choices.find(c => c.label == term)
          window.location.href = r.url;
        }
      })
    }

  }
});
