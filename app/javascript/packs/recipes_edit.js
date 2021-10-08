document.addEventListener("DOMContentLoaded", function(event) {

  var elements = document.querySelectorAll('[data-update-column]');
  for (const elem of elements) {
    const model = elem.dataset.model
    const url = elem.dataset.url
    const column = elem.dataset.updateColumn
    elem.addEventListener("focusout", function() {
      $.ajax({
        type: "PATCH",
        url: url,
        data: {
          authenticity_token: $('[name="csrf-token"]')[0].content,
          [model]: {
            [column]: elem.innerHTML
          }
        }
      });
    });
  }

  const button = document.getElementById("add-recipe-ingredient-form");

  button.addEventListener('click', event => {
    const originalForm = document.getElementById("new-recipe-ingredient-form");
    var form = originalForm.cloneNode(true)
    form.removeAttribute("id")
    form.classList.remove("invisible");
    //originalForm.parentNode.insertBefore(form, originalForm.nextElementSibbling)
    originalForm.insertAdjacentElement('beforebegin', form)

    var elem = form.querySelector('[data-autocomplete]');
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
  });

  //const element = document.getElementById("new-recipe-ingredient");
  //element.addEventListener("ajax:success", (event) => {
  //  const [_data, _status, xhr] = event.detail;
  //  document.getElementById("new-raw-quantity").value = ''
  //  document.getElementById("autocomplete-food").value = ''
  //  document.getElementById("autocomplete-food-id").value = ''
  //  //element.insertAdjacentHTML("beforeend", xhr.responseText);
  //});
  //element.addEventListener("ajax:error", () => {
  //  element.insertAdjacentHTML("beforeend", "<p>ERROR</p>");
  //});


})
