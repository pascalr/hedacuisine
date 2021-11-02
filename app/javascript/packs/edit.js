document.addEventListener("DOMContentLoaded", function(event) {

  var elements = document.querySelectorAll('[data-update-column]');
  for (const elem of elements) {
    const model = elem.dataset.model
    const url = elem.dataset.url
    const column = elem.dataset.updateColumn
    elem.addEventListener("focusout", function() {
      if(elem.tagName && elem.tagName.toLowerCase() == "textarea") {
        var content = elem.value
      } else {
        var content = elem.innerHTML
      }
      $.ajax({
        type: "PATCH",
        url: url,
        data: {
          authenticity_token: $('[name="csrf-token"]')[0].content,
          [model]: {
            [column]: content
          }
        }
      });
    });
  }
})
