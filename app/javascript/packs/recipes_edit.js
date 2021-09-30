document.addEventListener("DOMContentLoaded", function(event) { 

  const button = document.getElementById("add-recipe-ingredient-form");

  button.addEventListener('click', event => {
    const originalForm = document.getElementById("new-recipe-ingredient-form");
    var form = originalForm.cloneNode(true)
    form.removeAttribute("id")
    form.classList.remove("invisible");
    //originalForm.parentNode.insertBefore(form, originalForm.nextElementSibbling)
    originalForm.insertAdjacentElement('beforebegin', form)
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
