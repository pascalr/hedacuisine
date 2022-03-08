document.addEventListener("DOMContentLoaded", function(event) { 
  
  var elems = document.getElementsByClassName("calendar-day");
  for (var i = 0; i < elems.length; i++) {
    elems[i].addEventListener("click", function(ev) {
      document.getElementById("new_meal_form_year").value = this.dataset.year;
      document.getElementById("new_meal_form_month").value = this.dataset.month;
      document.getElementById("new_meal_form_day").value = this.dataset.day;
      var form = document.getElementById("new_meal_form")
      form.addEventListener("ajax:success", (event) => {
        const [_data, _status, xhr] = event.detail;
        var inserted = document.createElement('div')
        inserted.innerHTML = this.dataset.recipeName
        this.lastElementChild.appendChild(inserted)
      }, {once: true});
      //element.addEventListener("ajax:error", () => {
      //  element.insertAdjacentHTML("beforeend", "<p>ERROR</p>");
      //});
      //form.trigger('submit.rails');
      Rails.fire(form, 'submit');
      //form.submit();

    }, false)
  }

  elems = document.getElementsByClassName("inner-link");
  for (var i = 0; i < elems.length; i++) {
    elems[i].addEventListener("click", function(ev) {
      ev.stopPropagation();
    }, false)
  }
})
